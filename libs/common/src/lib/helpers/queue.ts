export class Queue {
  public readonly items: any[];

  constructor(...params: any[]) {
    console.log(params);
    this.items = [...params];
  }

  enqueue(item: any) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  getItems() {
    return this.items;
  }
}
