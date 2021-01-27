<template>
  <div id="kanban">
    <table>
      <thead>
      <tr>
        <th>
          TODO
        </th>
        <th>
          In Progress
        </th>
        <th>
          Done
        </th>
      </tr>
      </thead>

      <tbody>
      <tr>
        <td id="todo">
          <form @submit.prevent>
            <label>
              <input type="text" v-model="title" @keyup.enter="add()">
            </label>
            <button v-on:click="add()">+</button>
          </form>
          <div v-for="task in tasks" :id="task.id" v-if="task.status =='todo'" class="card">
            {{task.title}}
          </div>
        </td>
        <td id="progress">
          <div v-for="task in tasks" :id="task.id" v-if="task.status =='progress'" class="card">
            {{task.title}}
          </div>
        </td>
        <td id="done">
          <div v-for="task in tasks" :id="task.id" v-if="task.status =='done'" class="card">
            {{task.title}}
          </div>
        </td>
      </tr>
      </tbody>

      <tfoot>
      <tr>
        <td id="summary-todo">{{ summaryTodo }}</td>
        <td id="summary-progress">{{ summaryProgress }}</td>
        <td id="summary-done">{{ summaryDone }}</td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
const Vue = require('vue/dist/vue.js')
const VueResource = require('vue-resource');
Vue.use(VueResource);

module.exports = {
  props: {
    user_id: String,
    tasks_json: String
  },
  data() {
    return {
      summaryTodo: 0,
      summaryProgress: 0,
      summaryDone: 0,
      title: "",
      tasks: []
    }
  },
  created: function() {
    const _this = this

    JSON.parse(_this.tasks_json).forEach((task) => {
      _this.tasks.push({
        id: task.id,
        title: task.title,
        status: task.status,
      })
    });
    setTimeout(function () {
      _this.updateCounters()
      _this.drop()
      document.querySelectorAll(".card").forEach((card) => {
        _this.drag(card)
      })
    },500)
  },
  methods: {
    drop: function () {
      document.querySelectorAll("tbody td").forEach((td) => {
        td.addEventListener("dragover", (event) => {
          event.preventDefault()
        })

        td.addEventListener("drop", (event) => {
          this.toggleLoadingIcon()
          event.preventDefault()
          const data = event.dataTransfer.getData("text")
          event.target.appendChild(document.getElementById(data))
          this.update(data, event.target.id)
        })
      })
    },
    drag: function (el) {
      el.setAttribute("draggable", true)
      el.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text", event.target.id)
      })
    },
    add: function () {
      this.toggleLoadingIcon()
      const _this = this
      let task = {
        title: _this.title,
        id_user: _this.user_id,
      }

      _this.$http.post("/kanban", task)
          .then(response => {
            _this.clearInput()
            _this.updateCounters()
            let newElement = document.createElement("div")

            newElement.textContent = _this.title
            newElement.id = response
            newElement.classList.add("card")
            _this.drag(newElement)

            document.getElementById("todo").append(newElement)
            _this.toggleLoadingIcon()
          })
          .catch(error => {
            console.log(error);
            _this.toggleLoadingIcon()
          });
    },
    update: function (id_task, status) {
      const _this = this
      this.$http.put(`/kanban`, {id: id_task, status: status})
          .then(response => {
            _this.updateCounters()
            _this.toggleLoadingIcon()
          })
          .catch(error => {
            console.log(error);
            _this.toggleLoadingIcon()
          });
    },
    updateCounters: function () {
      this.summaryTodo = document.getElementById("todo").querySelectorAll(".card").length || 0
      this.summaryProgress = document.getElementById("progress").querySelectorAll(".card").length || 0
      this.summaryDone = document.getElementById("done").querySelectorAll(".card").length || 0
    },
    clearInput() {
      this.name = "";
    },
    toggleLoadingIcon: function () {
      const LOADING_CONTAINER = document.querySelectorAll(".loading-container")

      LOADING_CONTAINER.forEach((container) => {
        container.classList.toggle("hide")
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "public/stylesheets/colours";

#kanban {
  table {
    width: 100%;

    thead th {
      width: 33.333%;
      min-width: 200px;
      padding: 15px 35px;
      background-color: rgba(black, .3);
      color: $main_color;
      font: {
        size: 1.25em;
        weight: bold;
      }
      text-align: center;
    }

    tbody td {
      background-color: rgba(black, .15);
      vertical-align: top;

      input {
        width: calc(100% - 70px);
      }

      button {
        margin: 3px 0 7px 7px;
        padding: 5px 18px;
        font: {
          size: 1.1em;
          weight: bold;
        }
      }

      input,
      button {
        vertical-align: top;
      }
    }

    tfoot td {
      width: 33.333%;
      min-width: 200px;
      padding: 15px 35px;
      background-color: rgba(black, .3);
      color: $main_color;
    }
  }
}
</style>