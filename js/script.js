var first_name_obj, last_name_obj, email_obj, select_deck_type_obj, details_obj, email_submit_msg_obj;
var request_quote_btn, request_quote_container;
var img_carousel_composite, img_carousel_hardwood, img_carousel_softwood
var content_div, config_data

function on_load() {
    request_quote_btn = document.getElementById("request_quote_btn");
    request_quote_container = document.getElementById("request_quote_container");
    email_submit_msg_obj = document.getElementById("email_submit_msg");
    content_div = document.getElementById("content");

    // Request quote items
    first_name_obj = document.getElementById("fname");
    last_name_obj = document.getElementById("lname");
    email_obj = document.getElementById("email");
    select_deck_type_obj = document.getElementById("select_deck_type");
    details_obj = document.getElementById("details");
    request_quote_btn.addEventListener("click", function () {
        console.info("'request a quote' button clicked");
        request_quote_container.classList.remove("hidden");
    });


    // Event listener when Ctrl + Shift + f is pressed
    document.onkeyup = function (e) {
        if (e.ctrlKey && e.shiftKey && e.which == 70) {
            console.info("Ctrl + Shift + F shortcut combination was pressed");
            first_name_obj.value = "Julian"
            last_name_obj.value = "Inskip"
            email_obj.value = "julian.inskip@gmail.com"
            details_obj.innerHTML = "Text goes here"
        }
    };

    fetch("config.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            config_data = data;
            console.info(config_data)
            create_request_quote_window(config_data["request_quote"]);
            load_content(config_data["categories"]);
            // load_carousel_images(config_data);
        });

};

function create_request_quote_window(data) {
    console.group("Creating Request Quote window");
    console.info(data)
    var item_count = 0;
    var title_container = document.createElement("div");
    title_container.classList.add("request-quote-container-grid");
    var title_content = document.createElement("div");
    title_content.classList.add("request-quote-grid-" + item_count);
    
    // Add elements
    title_container.appendChild(title_content);
    request_quote_container.appendChild(title_container);
    console.groupEnd("Creating Request Quote window");
};

function load_content(data) {
    console.group("Loading content");
    for (var category in data) {
        var section_class = data[category]["class"];
        var img_side = data[category]["img_side"];
        var summary_txt = data[category]["summary"];
        var description = data[category]["description"];
        var carousel_images = data[category]["carousel-images"];
        var image_id = "img_carousel_" + category.toLowerCase();
        var main_section = document.createElement("section");
        main_section.classList.add(section_class);

        var container = document.createElement("div");
        container.classList.add("container");
        var split = document.createElement("div");
        split.classList.add("split");
        var content = document.createElement("div");
        var header = document.createElement("h2");
        header.innerHTML = category;
        var summary = document.createElement("p");
        summary.innerHTML = summary_txt;
        var image_container = document.createElement("div");
        image_container.id = image_id;
        image_container.classList.add("air-slider");
        load_carousel_images(category, image_container, carousel_images);

        // Add elements
        content.appendChild(header);
        content.appendChild(summary);
        if (img_side == "right") {
            split.appendChild(content);
            split.appendChild(image_container);
        }
        else if (img_side == "left") {
            split.appendChild(image_container);
            split.appendChild(content);
        }
        container.appendChild(split);
        main_section.appendChild(container);
        content_div.appendChild(main_section);
    };
    console.groupEnd("Loading content");
};

function load_carousel_images(image_group, image_container, image_group_obj) {
    console.group("Loading carousel images for:", image_group);
    img_count_hardw = 0;
    for (var image in image_group_obj) {
        var img_path = image_group_obj[image]["filename"];
        var group_div = document.createElement("div");
        var group_div_style = "display: none";
        if (img_count_hardw === 0) {
            group_div_style = "display: block";
            img_count_hardw += 1;
        }
        group_div.style = group_div_style;
        var img_element = document.createElement("img");
        img_element.src = img_path;
        img_element.alt = image;

        group_div.appendChild(img_element);
        image_container.appendChild(group_div);
        // if (image_group.toLowerCase() === "hardwood") image_container.appendChild(group_div);
        // else if (image_group.toLowerCase() === "softwood") image_container.appendChild(group_div);
        // else if (image_group.toLowerCase() === "composite") image_container.appendChild(group_div);
    };
    toggleCarousel("#img_carousel_" + image_group.toLowerCase(), 3000);
    console.groupEnd("Loading carousel images");
};

function toggleCarousel(component, toggle_time) {
    // JQuery to automate carousel toggle
    $(component + " > div:gt(0)").hide();

    setInterval(function () {
        $(component + ' > div:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo(component);
    }, toggle_time);
};

function sendEmail() {
    console.group("Sending email");
    var can_send_email = true;
    var send_email_msg = "";

    var first_name = titleCase(first_name_obj.value);
    var last_name = titleCase(last_name_obj.value);
    var email = email_obj.value;
    var select_deck_type = select_deck_type_obj.options[select_deck_type_obj.selectedIndex].text;
    var details = details_obj.value;

    console.info("First Name: ", first_name);
    console.info("Last Name: ", last_name);
    console.info("Email: ", email);
    console.info("Selection: ", select_deck_type);
    console.info("Details: ", details);
    if (first_name.length === 0) {
        can_send_email = false;
        send_email_msg += "Please fill in your first name<br>";
    }
    if (last_name.length === 0) {
        can_send_email = false;
        send_email_msg += "Please fill in your last name<br>";
    }
    if (email.length === 0) {
        can_send_email = false;
        send_email_msg += "Please fill in your email<br>";
    }
    if (details.length === 0) {
        can_send_email = false;
        send_email_msg += "Please fill in some details<br>";
    }
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!validateEmail(email)) {
        can_send_email = false;
        send_email_msg += "Email entered is not valid<br>";
    }

    // https://app.elasticemail.com/
    // SecureToken : 12bd2168-f436-48b3-a3e1-b22a12e964ab (Domain: *.etgnz.eagle.co.nz)
    if (can_send_email) {
        email_submit_msg_obj.innerHTML = "Sending email...";
        email_submit_msg_obj.classList.remove("fail");
        email_submit_msg_obj.classList.remove("pass");
        var body_text = "<h1>Request for quote</h1><p>You have received a request for quote with the following details:</p>\
<ul>\
<li><b>First Name</b>: " + first_name + "</li>\
<li><b>Last Name</b>: " + last_name + "</li>\
<li><b>Email</b>: " + email + "</li>\
<li><b>Deck Type</b>: " + select_deck_type + "</li>\
<li><b>Details</b>: " + details + "</li>\
</ul>\
<br>Thanks.<br>Your awesome website.\
"
        console.info(body_text);
        var secure_token = config_data["main"]["email_details"]["secure_token"];
        var email_from = config_data["main"]["email_details"]["from"];
        var email_to = config_data["main"]["email_details"]["to"];
        var email_subject = config_data["main"]["email_details"]["subject"] + first_name + " " + last_name;
        console.info("secure_token:", secure_token);
        console.info("email_from:", email_from);
        console.info("email_to:", email_to);
        console.info("email_subject:", email_subject);
        email_submit_msg_obj.classList.add("pass");
        Email.send({
            SecureToken: secure_token,
            To: email_to,
            From: email_from,
            Subject: email_subject,
            Body: body_text
        }).then(
            message => {
                email_submit_msg_obj.innerHTML = "Thank you <b>" + first_name + "</b> for sending a request for quote. We will get back to you soon.";
                email_submit_msg_obj.classList.remove("hidden");
                email_submit_msg_obj.classList.remove("fail");
                email_submit_msg_obj.classList.add("pass");
                console.info("  () message: ", message);

                function delay(time) {
                    return new Promise(resolve => setTimeout(resolve, time));
                }
                delay(10000).then(() => clear_request_form());
                // alert(message);
            }
        );
    }
    else {
        email_submit_msg_obj.innerHTML = send_email_msg;
        email_submit_msg_obj.classList.remove("hidden");
        email_submit_msg_obj.classList.remove("pass");
        email_submit_msg_obj.classList.add("fail");
    }

    console.groupEnd("Sending email");
};

function clear_request_form(clear_all = true) {
    request_quote_container.classList.add("hidden");
    email_submit_msg_obj.classList.add("hidden");
    email_submit_msg_obj.innerHTML = "";
    if (clear_all) {
        first_name_obj.value = "";
        last_name_obj.value = "";
        email_obj.value = "";
        details_obj.value = "";
    }
};

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}
