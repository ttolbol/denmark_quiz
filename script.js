let ministers_dict;
let ministers;
let minister_idx = 0;

function init() {
    function init_question(minister){
        const minister_txt = $(".minister");
        const img = $(".card-img-top");
        const txt = $(".card-title");
        img.removeClass("deblur-image-anim");
        txt.removeClass("deblur-text-anim");
        img.addClass("blurry-image");
        txt.addClass("blurry-text");

        minister_txt.html(minister);
        txt.html(ministers_dict[minister].name);
        img.attr("src", "./photos/"+ministers_dict[minister].photo);

        img.replaceWith(img[0].outerHTML);

        // generate answer keys
        let answer_keys = [];
        const correct_name = ministers_dict[minister].name;
        answer_keys.push(correct_name);
        while (answer_keys.length < 5){
            let wrong_answer_idx = parseInt(ministers.length * Math.random());
            let wrong_answer_minister = ministers[wrong_answer_idx];
            let wrong_name = ministers_dict[wrong_answer_minister].name;
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
        minister_idx += 1;
        if (minister_idx >= ministers.length){
            minister_idx = 0;
        }
        init_question(ministers[minister_idx]);
    })

    ministers = Object.keys(ministers_dict).sort((a, b) => 0.5 - Math.random());
    init_question(ministers[0]);
}

fetch('./ministers.json')
    .then((response) => response.json())
    .then((json) => {ministers_dict = json; init();});