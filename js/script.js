class TareaManager {
  constructor() {
    this.input = document.querySelector("#txtTarea");
    this.addBtn = document.querySelector(".btn-add");
    this.ul = document.querySelector("ul");
    this.empty = document.querySelector(".empty");

    this.tareas = [];

    this.addBtn.addEventListener("click", () => {
      this.agregarTarea(this.input.value);
    });

    this.cargarTareas();
  }

  agregarTarea(texto) {
    if (texto.trim() === "") {
      this.input.classList.remove('error');
      void this.input.offsetWidth;
      this.input.classList.add('error');
      this.input.placeholder = "Por favor rellene este campo";
      return;
    } else {
      this.input.classList.remove('error');
      this.input.placeholder = "Agregar Tarea ...";
    }

    const tarea = { id: Date.now(), texto };
    this.tareas.push(tarea);
    this.guardarTareas();

    const li = this.crearElementoTarea(tarea);
    this.ul.appendChild(li);

    this.input.value = "";
    this.actualizarEstado();
  }

  crearElementoTarea(tarea) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = tarea.texto;

    li.appendChild(p);
    li.appendChild(this.crearBotonEliminar(li, tarea.id));
    return li;
  }

  crearBotonEliminar(li, id) {
    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.className = "btn-delete";
    btn.addEventListener("click", () => {
      li.classList.add("oculto");
      setTimeout(() => {
        this.ul.removeChild(li);
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarTareas();
        this.actualizarEstado();
      }, 300);
    });
    return btn;
  }

  actualizarEstado() {
    const hayTareas = this.ul.querySelectorAll("li").length > 0;
    this.empty.style.display = hayTareas ? "none" : "block";
  }

  guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }

  async cargarTareas() {
    const tareasGuardadas = localStorage.getItem("tareas");

    if (tareasGuardadas) {
      this.tareas = JSON.parse(tareasGuardadas);
    } else {
      try {
        const res = await fetch("json/tareas.json");
        this.tareas = await res.json();

        this.tareas = this.tareas.map(t => {
          if (!t.id) t.id = Date.now() + Math.random();
          return t;
        });

        this.tareas = this.tareas.filter(t => !t.esPlaceholder);
        this.guardarTareas();
      } catch (err) {
        console.error("Error al cargar tareas:", err);
        this.tareas = [];
      }
    }

    this.tareas.forEach(t => {
      const li = this.crearElementoTarea(t);
      this.ul.appendChild(li);
    });

    this.actualizarEstado();
  }
}

new TareaManager();
