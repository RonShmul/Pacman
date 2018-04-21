var currentUser;
var userArray = [{username: "a",
    password: "a",
    fname: "Admin",
    lname: "",
    email: "a@a.a",
    highestScore: 0}];
var fError = false;
var uError = false;
var lError = false;
var pError = false;
var eError = false;

// Wait for the DOM to be ready
$(function() {
    toggle('welcome');
    $("nav").hide();
    $("#uname-error").hide();
    $("#fname-error").hide();
    $("#lname-error").hide();
    $("#pass-error").hide();
    $("#email-error").hide();

    $("#uname-input").focusout(function () {
        check_username();
    });
    $("#fname-input").focusout(function () {
        var nameValue = $("#fname-input").val();
        check_fname(nameValue);
    });
    $("#lname-input").focusout(function () {
        var nameValue = $("#lname-input").val();
        check_lname(nameValue);
    });
    $("#pass-input").focusout(function () {
        check_password();
    });

    $("#email-input").focusout(function () {
        check_email();
    });
});

function check_username() {
    var isExist = false;
    var form = document.getElementById("register-form");
    for(var i = 0; i < userArray.length; i++) {
        var some_user = userArray[i];
        if(some_user.username.localeCompare(form.elements[0].value) == 0) {
            isExist = true;
            break;
        }
    }
    if(isExist) {
        $("#uname-error").html("Username is already taken");
        $("#uname-error").show();
        uError = true;
    } else {
        $("#uname-error").hide();
    }
}
function check_fname(name_value) {
    if (!name_value.match(/^[a-zA-Z, '']+$/)) {
        $("#fname-error").html("Please enter only Alphabetic characters");
        $("#fname-error").show();
        fError = true;
    } else {
        $("#fname-error").hide();
    }
}
function check_lname(name_value) {
    if (!name_value.match(/^[a-zA-Z, '']+$/)) {
        $("#lname-error").html("Please enter only Alphabetic characters");
        $("#lname-error").show();
        lError = true;
    } else {
        $("#lname-error").hide();
    }
}
function check_password() {
    var password_length = $("#pass-input").val().length;

    if(!$("#pass-input").val().match(/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/)) {
        if (password_length < 8) {
            $("#pass-error").html("At least 8 characters");
            $("#pass-error").show();
            pError = true;
        } else {
            $("#pass-error").html("Password should contains both letters and numbers");
            $("#pass-error").show();
            pError = true;
        }
    }else {
        $("#pass-error").hide();
    }
}

function check_retype_password() {

    var password = $("#form_password").val();
    var retype_password = $("#form_retype_password").val();

    if (password != retype_password) {
        $("#retype_password_error_message").html("Passwords don't match");
        $("#retype_password_error_message").show();
        error_retype_password = true;
    } else {
        $("#retype_password_error_message").hide();
    }

}

function check_email() {
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);

    if (pattern.test($("#email-input").val())) {
        $("#email-error").hide();
    } else {
        $("#email-error").html("Invalid email address");
        $("#email-error").show();
        eError = true;
    }
}

function check_login() {
    var form = document.getElementById("login-form");
    var isExist = false;
    for(var i = 0; i < userArray.length; i++) {
        var some_user = userArray[i];
        if(some_user.username.localeCompare(form.elements[0].value) == 0 && some_user.password.localeCompare(form.elements[1].value) == 0) {
            updateCurrentUser(some_user);
            isExist = true;
            break;
        }
    }
    return isExist;
}
$("#login-form").submit(function() {
    if (check_login()) {
        document.getElementById("login-form").reset();
        toggle('enter-game');
        $("#login-error").hide();
        $("nav").show();
        return false;
    } else {
        $("#login-error").html("Invalid username or password");
        $("#login-error").show();
        return false;
    }
});

$("#register-form").submit(function() {
    uError = false;
    fError = false;
    lError = false;
    pError = false;
    eError = false;

    check_username();
    var namefValue = $("#fname-input").val();
    var namelValue = $("#lname-input").val();
    check_fname(namefValue);
    check_lname(namelValue);
    check_password();
    check_email();

    if (uError == false && fError == false && lError == false && pError == false && eError == false) {
        getRegisterValues();
        $("nav").show();
        return false;
    } else {
        return false;
    }
});

function toggle(target) {
    var artz = document.getElementsByClassName('page');
    var targ = document.getElementById(target);

    // hide all
    for (var i = 0; i < artz.length; i++) {
        artz[i].style.display = 'none';
    }
    // toggle current
    targ.style.display = 'block';

    return false;
}

function getRegisterValues() {

    var form = document.getElementById("register-form");
    var newUser = {
        username: form.elements[0].value,
        password: form.elements[1].value,
        fname: form.elements[2].value,
        lname: form.elements[3].value,
        email: form.elements[4].value,
        birthDate: form.elements[5].value,
        highestScore: 0
    };

    userArray.push(newUser);
    updateCurrentUser(newUser);
    document.getElementById("register-form").reset();
    toggle('enter-game');
}

function updateCurrentUser(newUser) {
    currentUser = newUser;
    if (currentUser == null) {
        document.getElementById('the-user').innerHTML = "hello, Guest";
    }
    else {
        document.getElementById('the-user').innerHTML = "hello, " + currentUser.fname + " " + currentUser.lname;
    }
}
var about = document.getElementById('about_id');
var btn = document.getElementById("about_link");
var close_btn = document.getElementById("close_id");

// btn.onclick = function() {
//     about.style.display = "block";
// };
//
// close_btn.onclick = function() {
//     about.style.display = "none";
// };
//
// window.onclick = function(event) {
//     if (event.target == about) {
//         about.style.display = "none";
//     }
// };