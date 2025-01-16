new Vue({
  el: "#app",
  data: {
    info: {},
    log: [],
    database: "data/data.json",
    prompt: "",
    command: document.getElementById("command"),
    lang: "",
    prefs: {
      name: "dave",
      theme: "homebrew",
      mute: "off",
    },
  },

  ready: function () {
    this.import();
    this.store();
    this.command.focus();
  },

  watch: {
    lang: function () {
      this.submit();
    },

    prefs: {
      handler: function (nuval, olval) {
        localStorage.setItem("prefs", JSON.stringify(nuval));
      },
      deep: true,
    },
  },

  methods: {
    activate: function () {
      this.command.focus();
      if (this.prefs.mute == "off") {
        document.getElementById("beep").play();
      }
      if (Modernizr.touch) {
        this.command.addEventListener("blur", this.submit(), true);
      }
    },

    import: function () {
      var that = this;
      var request = new XMLHttpRequest();
      request.open("GET", this.database);
      request.onload = function () {
        var result = JSON.parse(request.responseText);
        that.info = result;
        that.log = result.hello;
      };
      request.send();
    },

    submit: function () {
      if (Modernizr.touch) {
        this.prompt = this.prompt.toLowerCase().trim();
      }
      switch (this.lang) {
        case "social":
          this.social();
          break;
        case "hello":
          this.hello();
          break;
        default:
          this.exec();
      }
    },

    exec: function () {
      switch (this.prompt) {
        case "cls":
        case "clear":
          this.log = [];
          if (Modernizr.touch) {
            window.scrollTo(0, 0);
          }
          break;
        case "help":
          this.log.push({ message: this.prompt, class: "echo" });
          this.log.push(...this.info.help);
          break;
        case "reboot":
          this.import();
          if (Modernizr.touch) {
            window.scrollTo(0, 0);
          }
          break;
        case "social":
        case "contact":
          this.log.push({ message: this.prompt, class: "echo" });
          this.lang = "social";
          break;
        case "about":
          this.log.push({ message: this.prompt, class: "echo" });
          this.log.push(...this.info.about);
          break;
        case "portfolio":
          this.log.push({ message: this.prompt, class: "echo" });
          this.log.push({
            message:
              "Sorry " + this.prefs.name + ", I'm afraid I can't do that",
          });
          break;
        case "date":
        case "time":
          this.log.push({ message: this.prompt, class: "echo" });
          var clock = new Date().toString();
          this.log.push({ message: clock });
          break;
        case "hello":
        case "hi":
        case "how are you?":
          this.log.push({ message: this.prompt, class: "echo" });
          this.lang = "hello";
          break;
        case "name":
        case "what's my name":
        case "what's my name?":
        case "what is my name":
        case "what is my name?":
          this.log.push({ message: this.prompt, class: "echo" });
          this.log.push({ message: "Your name is " + this.prefs.name });
          break;
        case "mute":
          this.log.push({ message: this.prompt, class: "echo" });
          if (this.prefs.mute == "off") {
            this.prefs.mute = "on";
          } else {
            this.prefs.mute = "off";
          }
          this.log.push({ message: "Mute is " + this.prefs.mute });
          break;
        case "theme":
        case "themes":
          this.log.push({ message: this.prompt, class: "echo" });
          this.log.push(...this.info.themes);
          break;
        case "homebrew":
        case "brew":
        case "solarized":
        case "solarized-light":
        case "solarized-dark":
        case "light":
        case "dark":
        case "c-64":
        case "trs-80":
          this.log.push({ message: this.prompt, class: "echo" });
          this.prefs.theme = this.prompt;
          break;
        default:
          this.log.push({ message: this.prompt, class: "echo" });
      }
      this.prompt = "";
    },

    social: function () {
      function goto(url) {
        window.open(url, "_blank");
      }

      switch (this.prompt) {
        case "":
          this.log.push(...this.info.social);
          break;
        case "1":
          this.log.push({ message: "Opening Bluesky" });
          goto("https://bsky.app/profile/harrypujols.com");
          this.lang = "exec";
          break;
        case "2":
          this.log.push({ message: "Opening Linkedin" });
          goto("https://www.linkedin.com/in/harrypujols");
          this.lang = "exec";
          break;
        case "3":
          this.log.push({ message: "Opening Stack Overflow" });
          goto("http://stackoverflow.com/users/1653276/harrypujols");
          this.lang = "exec";
          break;
        case "4":
          this.log.push({ message: "Opening Stack Github" });
          goto("https://github.com/harrypujols");
          this.lang = "exec";
          break;
        case "x":
          this.lang = "exec";
          this.exec();
          break;
        default:
          this.log.push({ message: "Unrecognized number. Use x to exit." });
      }
      this.prompt = "";
    },

    hello: function () {
      if (this.prompt == "") {
        this.log.push({ message: "What is your name?" });
      } else {
        this.log.push({ message: this.prompt, class: "echo" });
        this.prefs.name = this.prompt;
        this.log.push({ message: "Hello, " + this.prefs.name });
        this.prompt = "";
        this.lang = "exec";
        this.exec();
      }
    },

    store: function () {
      var retrieve = localStorage.getItem("prefs");
      if (retrieve == null) {
        localStorage.setItem("prefs", JSON.stringify(this.prefs));
      } else {
        this.prefs = JSON.parse(retrieve);
      }
    },
  },
});
