import "./style.css";
import { sum } from "./sum";

export { sum } from "./sum";

console.log(sum(1, 2));
import { Model, Presenter, View } from "./framework";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}
const todoModel = new Model<Todo[]>([]);

todoModel.subscribe((data: Todo[]) => {
  console.log("Los datos han cambiado:", data);
});

todoModel.data = [
  { id: 1, text: "Comprar leche", done: false },
  { id: 2, text: "Hacer ejercicio", done: true },
  { id: 3, text: "Leer un libro", done: false },
];
const root = document.getElementById("app") || document.createElement("div");
const template: (data: Todo[]) => string = (data: Todo[]) => {
  return `
    <ul>
      ${data.map(todo => `<li>${todo.text}</li>`).join("")}
    </ul>
  `;
};

const todoPresenter = new Presenter<Todo[]>(todoModel, template, root);
const todoView = new View<Todo[]>(root, template, todoPresenter);

todoPresenter.data = [
  { id: 1, text: "Comprar leche", done: false },
  { id: 2, text: "Hacer ejercicio", done: true },
  { id: 3, text: "Leer un libro", done: false },
];

todoPresenter.data = [
  { id: 1, text: "Comprar leche", done: false },
  { id: 2, text: "Hacer ejercicio", done: true },
  { id: 3, text: "Leer un libro", done: false },
];
todoView.render();
