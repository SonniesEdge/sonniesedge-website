import lozad from 'lozad';

export default class Test {
  constructor() {
    console.log('lozad!');
    const el = document.querySelector('.comp-wm-links__image');
    const observer = lozad(el);
    observer.observe();
  }
}
