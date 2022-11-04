let party_leaders_dict;
let party_leaders;
let ministers_dict;
let ministers;
let minister_idx = 0;
let party_leaders_idx = 0;
let mode = "ministers";

function init() {
    const question_txt = $("#question");

    function init_question(name, names, dict){
        const img = $(".card-img-top");
        const txt = $(".card-title");
        img.removeClass("deblur-image-anim");
        txt.removeClass("deblur-text-anim");
        img.addClass("blurry-image");
        txt.addClass("blurry-text");

        txt.html(dict[name].name);
        img.attr("src", "./photos/"+dict[name].photo);

        img.replaceWith(img[0].outerHTML);

        // generate answer keys
        let answer_keys = [];
        const correct_name = dict[name].name;
        answer_keys.push(correct_name);
        while (answer_keys.length < 5){
            let wrong_answer_idx = parseInt(names.length * Math.random());
            let wrong_answer_minister = names[wrong_answer_idx];
            let wrong_name = dict[wrong_answer_minister].name;
            if (!answer_keys.includes(wrong_name)){
                answer_keys.push(wrong_name);
            }
        }

        // shuffle answers
        answer_keys = answer_keys.sort((a, b) => 0.5 - Math.random());

        // fill answers to buttons
        for (let i = 0; i < 5; i++){
            $("#answer"+i).html(answer_keys[i]);
        }
    }

    $(".answer-btn").on("click", function(){
        const img = $(".card-img-top");
        const txt = $(".card-title");
        img.removeClass("blurry-image");
        img.addClass("deblur-image-anim");
        txt.removeClass("blurry-text");
        txt.addClass("deblur-text-anim");
    });

    $("#next-btn").on("click", function (){
        let temp_mode = mode;
        if (temp_mode === "both"){
            temp_mode = Math.random() < 0.5 ? "ministers" : "leaders";
        }
        if (temp_mode === "ministers") {
            minister_idx += 1;
            if (minister_idx >= ministers.length) {
                minister_idx = 0;
                ministers = ministers.sort((a, b) => 0.5 - Math.random());  // shuffle
            }
            const minister = ministers[minister_idx]
            question_txt.html(`Hvem er Danmarks <i>${minister}</i>?`);
            init_question(minister, ministers, ministers_dict);
        } else if (temp_mode === "leaders"){
            party_leaders_idx += 1;
            if (party_leaders_idx >= party_leaders.length) {
                party_leaders_idx = 0;
                party_leaders = party_leaders.sort((a, b) => 0.5 - Math.random());  // shuffle
            }
            const leader = party_leaders[party_leaders_idx];
            question_txt.html(`Hvem er leder af <i>${leader}</i>?`);
            init_question(leader, party_leaders, party_leaders_dict);
        }
    });

    $(".question-options").on("change", function(){
        mode = $(".question-options:checked").data("option");
    })

    ministers = Object.keys(ministers_dict).sort((a, b) => 0.5 - Math.random());
    party_leaders = Object.keys(party_leaders_dict).sort((a, b) => 0.5 - Math.random());
    question_txt.html(`Hvem er Danmarks <i>${ministers[0]}</i>?`);
    init_question(ministers[0], ministers, ministers_dict);
}

fetch('./data.json')
    .then((response) => response.json())
    .then((data) => {ministers_dict = data['ministers']; party_leaders_dict = data['parties']; init();});