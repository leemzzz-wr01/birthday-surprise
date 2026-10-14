const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const React = require('react');
const esbuild = require('esbuild');

// Exercise the real component handlers using a minimal hook/timer harness.
let store, cursor;
React.useState = (initial) => {
  const stateStore = store;
  const slot = cursor++;
  if (!(slot in store)) store[slot] = initial;
  return [store[slot], (value) => { stateStore[slot] = typeof value === 'function' ? value(stateStore[slot]) : value; }];
};
React.useRef = (initial) => {
  const slot = cursor++;
  if (!(slot in store)) store[slot] = { current: initial };
  return store[slot];
};
React.useEffect = () => {};
global.window = { matchMedia: () => ({ matches: false }), scrollTo() {} };
global.history = { pushState() {} };
let queued;
global.setTimeout = (callback) => { queued = callback; return 1; };
const source = fs.readFileSync('App.jsx', 'utf8') + '\nexport { Balloons, Message, Pics, Polaroid, PHOTOS, TEXT };';
const code = esbuild.transformSync(source, { loader: 'jsx', format: 'cjs', jsx: 'automatic', define: { 'import.meta.env.BASE_URL': '"/"' } }).code;
const mod = new Module(path.resolve('balloon-test-runtime.cjs'));
mod.filename = path.resolve('balloon-test-runtime.cjs');
mod.paths = Module._nodeModulePaths(process.cwd());
const originalRequire = mod.require.bind(mod);
mod.require = (id) => id.endsWith('.jpg') ? id : originalRequire(id);
mod._compile(code, mod.filename);
const { default: App, Balloons, Message, Pics } = mod.exports;
const appState = [];
const render = (component, state, props = {}) => { store = state; cursor = 0; return component(props); };
const active = () => render(App, appState).props.children.find((node) => node?.props?.className === 'birthday-scenes').props.children.filter(Boolean)[0];
const nodes = (node) => {
  if (!node || typeof node !== 'object') return [];
  return [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)];
};
let playCalls = 0, pauseCalls = 0;
const player = {
  src: '', error: null,
  getAttribute() { return this.src; },
  play() { playCalls++; return Promise.resolve(); },
  pause() { pauseCalls++; }, load() {},
};
render(App, appState).props.children[0].ref.current = player;
assert.equal(player.src, ''); // no request or autoplay on the password screen
active().props.onUnlock();
assert.equal(playCalls, 1);
assert.equal(player.src, '/audio/birthday-song.mp3');
for (const [index, id] of ['note', 'wish', 'pics'].entries()) {
  const selection = active();
  assert.equal(selection.type, Balloons);
  assert.equal(selection.props.visited.length, index);
  const tree = render(Balloons, [], selection.props);
  assert.equal(nodes(tree).some((node) => node.props.children === 'Next: Birthday Cake 🎂'), false);
  const buttons = nodes(tree).filter((node) => node.type === 'button');
  assert.equal(buttons.length, 3);
  buttons[index].props.onClick();
  buttons[(index + 1) % 3].props.onClick(); // rapid second click must be ignored
  assert.equal(active().type, Balloons); // animation finishes before navigation
  queued();
  const content = active();
  assert.equal(content.type, id === 'pics' ? Pics : Message);
  assert.equal(appState[3], id); // selected balloon state
  assert.equal(content.props.onNext, undefined);
  const contentTree = render(content.type, [], content.props);
  const back = nodes(contentTree).find((node) => node.props.children === 'Back to Balloons 🎈');
  assert.ok(back);
  back.props.onClick();
  assert.equal(active().type, Balloons);
  assert.equal(active().props.visited.length, index + 1);
}
const completed = active();
const tree = render(Balloons, [], completed.props);
const cake = nodes(tree).find((node) => node.props.children === 'Next: Birthday Cake 🎂');
assert.ok(cake);
// Reopening a completed balloon doesn't count again or rerun the pop timer.
nodes(tree).find((node) => node.type === 'button').props.onClick();
active().props.onBack();
assert.equal(active().props.visited.length, 3);
const returned = render(Balloons, [], active().props);
nodes(returned).find((node) => node.props.children === 'Next: Birthday Cake 🎂').props.onClick();
assert.equal(active().type.name, 'Cake');
assert.equal(playCalls, 1); // scene changes never restart playback
let appTree = render(App, appState);
appTree.props.children[0].props.onPlaying();
appTree = render(App, appState);
nodes(appTree).find((node) => node.props['aria-label'] === 'Pause birthday music').props.onClick();
assert.equal(pauseCalls, 1);
appTree.props.children[0].props.onPause();
appTree = render(App, appState);
nodes(appTree).find((node) => node.props['aria-label'] === 'Play birthday music').props.onClick();
assert.equal(playCalls, 2);
nodes(appTree).find((node) => node.props['aria-label'] === 'Mute birthday music').props.onClick();
assert.equal(render(App, appState).props.children[0].props.muted, true);
render(App, appState).props.children[0].props.onError();
assert.ok(nodes(render(App, appState)).some((node) => node.props.className?.split(' ').includes('music-error')));
const compactControls = nodes(render(App, appState)).find((node) => node.type === 'aside');
const musicButtons = nodes(compactControls).filter((node) => node.type === 'button');
assert.equal(musicButtons.length, 2);
assert.ok(musicButtons.every((node) => node.props['aria-label'] && node.props.children.type === 'span'));
console.log('PASS: no initial autoplay; unlock starts once; scenes keep audio; play/pause/mute handlers and missing-file feedback.');
console.log('PASS: three individual clicks, pop timing, duplicate-click guard, own content, return buttons, retained progress, cake gate and navigation.');

const { Polaroid, PHOTOS, TEXT } = mod.exports;
const diaryState = [];
let opened = 0, closed = 0, returnedToBalloons = 0;
const diary = () => render(Pics, diaryState, { onBack: () => returnedToBalloons++ });
const initialDiary = diary();
diaryState[1].current = { showModal: () => opened++, close: () => closed++ };
for (let index = 0; index < PHOTOS.length; index++) {
  const page = diary();
  const photo = nodes(page).find((node) => node.type === Polaroid);
  assert.equal(photo.props.photo, PHOTOS[index]);
  assert.ok(nodes(page).some((node) => node.props.className === 'diary-poem' && node.props.children === TEXT.poem[index]));
  const print = render(Polaroid, [], photo.props);
  assert.ok(nodes(print).some((node) => node.type === 'img' && node.props.alt === PHOTOS[index].caption));
  nodes(print).find((node) => node.type === 'button').props.onClick();
  nodes(page).find((node) => node.props.className === 'diary-close').props.onClick();
  const next = nodes(page).find((node) => node.props.children === 'Next memory →');
  assert.equal(next.props.disabled, index === PHOTOS.length - 1);
  if (index < PHOTOS.length - 1) next.props.onClick();
}
assert.equal(opened, 3);
assert.equal(closed, 3);
for (let index = PHOTOS.length - 1; index > 0; index--) {
  nodes(diary()).find((node) => node.props.children === '← Previous memory').props.onClick();
}
assert.equal(diaryState[0], 0);
nodes(diary()).find((node) => node.props.children === 'Back to Balloons 🎈').props.onClick();
assert.equal(returnedToBalloons, 1);
console.log('PASS: all original diary photos/captions/poems, previous/next boundaries, enlarged-photo open/close handlers, and Back navigation.');
