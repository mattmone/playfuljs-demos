export class Items extends Array {
  get weapons() {
    return this.filter(item => item.category === 'weapon');
  }
  get helms() {
    return this.filter(item => item.type === 'helm');
  }
  get body() {
    return this.filter(item => item.type === 'body');
  }
  get gloves() {
    return this.filter(item => item.type === 'gloves');
  }
  get boots() {
    return this.filter(item => item.type === 'boots');
  }
  get rings() {
    return this.filter(item => item.category === 'ring');
  }
  get gems() {
    return this.filter(item => item.category === 'gem');
  }
}
