(function () {
  class FormData {
    constructor(email, password, passwordConfirm) {
      this.cardentials = {
        email: email.trim(),
        password: password.trim(),
        passwordConfirm: passwordConfirm.trim(),
      };
      this.emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      this.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
      this.error = "";
    }

    appendError(msg) {
      this.error = msg;
    }

    isEmailValid() {
      try {
        let valid = this.emailRegex.test(this.cardentials.email.toLowerCase());
        if (valid) return valid;
        else this.appendError("Email is not valid");
      } catch (err) {
        this.appendError("Error validating email");
      }
    }

    isPasswordValid() {
      try {
        let valid = this.passwordRegex.test(this.cardentials.password);
        if (valid) return valid;
        else this.appendError("Passowrd is not valid");
      } catch (err) {
        this.appendError("Error validating password");
      }
    }

    isPasswordMatch() {
      try {
        let matches =
          this.cardentials.password === this.cardentials.passwordConfirm;
        if (matches) return matches;
        else this.appendError("Password don't match");
      } catch (err) {
        this.appendError("Error matching passwords");
      }
    }

    isFieldEmpty() {
      try {
        let notEmpty =
          this.cardentials.email &&
          this.cardentials.passwordConfirm &&
          this.cardentials.password;
        if (notEmpty) return true;
        else this.appendError("All fields are required");
      } catch (err) {
        this.appendError("Oops something went terribly wrong :(");
      }
    }
  }

  class UI {
    constructor() {
      this.form = document.querySelector("#form");
      this.emailInput = document.querySelector("#email");
      this.passwordInput = document.querySelector("#password");
      this.passwordConfirmInput = document.querySelector("#password-confirm");
      this.errorPanel = document.querySelector("#error");
    }
  }

  class App {
    constructor(data, ui) {
      this.data = data;
      this.ui = ui;
      this.authApiBaseUrl = "http://localhost:4000/api/user";
      this.init();
    }

    init() {
      // value assignment (it would be usually empty so not neccesry but for testing and data binding)
      this.ui.emailInput.value = this.data.cardentials.email;
      this.ui.passwordInput.value = this.data.cardentials.password;
      this.ui.passwordConfirmInput.value = this.data.cardentials.passwordConfirm;

      //add event listerners
      this.ui.form.addEventListener("submit", (e) => this.handleSubmit(e));

      this.ui.emailInput.addEventListener("keyup", (e) =>
        this.handleDataChange(e)
      );
      this.ui.passwordInput.addEventListener("keyup", (e) =>
        this.handleDataChange(e)
      );
      this.ui.passwordConfirmInput.addEventListener("keyup", (e) =>
        this.handleDataChange(e)
      );
    }

    handleDataChange(e) {
      this.data.cardentials[e.target.name] = e.target.value;
    }
    //submits and send an api call to server
    async handleSubmit(e) {
      e.preventDefault();
      if (
        this.data.isFieldEmpty() &&
        this.data.isEmailValid() &&
        this.data.isPasswordValid() &&
        this.data.isPasswordMatch()
      ) {
        //form is valid
        try {
          let res = await fetch(this.authApiBaseUrl, {
            method: "POST",
            body: JSON.stringify(this.data.cardentials),
            headers: {
              "Content-Type": "application/json",
            },
          });

          let returnCode = await res.json();
          if (returnCode === 1) {
            document.body.innerHTML += `<h1 class="success">Login succesfully</h1>`;
          } else {
            setTimeout(() => {
              this.ui.errorPanel.innerText = "";
            }, 1000);
            this.ui.errorPanel.innerText =
              returnCode === 409
                ? "Email already exists please try again"
                : "Something went wrong :(";
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        this.ui.errorPanel.innerText = this.data.error;
        setTimeout(() => {
          this.ui.errorPanel.innerText = "";
        }, 1000);
        //form is invalid return error message
      }
    }

    getData() {
      this.ui.handleChange();
    }
  }
  const UserData = new FormData(
    "dannyboris@gmail.com",
    "dannyboriS1",
    "dannyboriS1"
  );

  const UserInterface = new UI();
  new App(UserData, UserInterface);
})();
