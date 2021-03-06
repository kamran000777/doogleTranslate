import countries from "./countries.js";
let text_to_translate = document.querySelector(".to__translate");
let text_translated = document.querySelector(".translated");
const selects = document.querySelectorAll("select");
const translate_btn = document.querySelector(".btn");
const exchange_icon = document.querySelector('.exchange i');
const copys = document.querySelectorAll('.fa-copy');
const speaks = document.querySelectorAll('.fa-volume-up');


//adding options to the each select tag and making English and Hindi the default lang
const languageArr = Object.values(countries);
selects.forEach((select, id) => {
  let option;
  for (let lang of languageArr) {
    let selected =
      id === 0
        ? lang === "English"
          ? "selected"
          : ""
        : lang === "Hindi"
        ? "selected"
        : "";
    option += `<option ${selected} value=${lang}>${lang}</option>`;
  }
  select.innerHTML = option;
});

//handleing the translate request
translate_btn.addEventListener('click',(e)=>{
      translatedData();
})

//exchanging the text and the select value
exchange_icon.addEventListener('click',()=>{
      
      let tempSelect = selects[0].value; 
      selects[0].value= selects[1].value;
      selects[1].value = tempSelect;

      let tempText = text_to_translate.value;
      text_to_translate.value = text_translated.value;
      text_translated.value = tempText;
})

//fetching the translate request
function translatedData(){
      const translateFrom = selects[0].value;
      const translateTo = selects[1].value;
      const text = text_to_translate.value.length>0?text_to_translate.value:"Enter Input";
      text_translated.setAttribute("placeholder","Translating...");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
       console.log(text_to_translate.value)
      fetch(apiUrl).then(res=>res.json()).then(res=>displayResult(res.responseData)).catch((err)=>console.log(err))
}


//displaying the result in the second field
function displayResult(result){
  text_translated.value =result.translatedText;
}

//enabling the copy icons to copy the relavant textarea input feild value
copys.forEach((copy,index)=>{
      if(index==0){
            copy.addEventListener('click',()=>{
                  let text = text_to_translate.value;
                  navigator.clipboard.writeText(text);
            })
      }else{
            copy.addEventListener('click',()=>{
                  let text = text_translated.value;
                  navigator.clipboard.writeText(text);
            })  
      }
})

//enabling the speak icons to speak the relavant textarea input by using the web speech api
speaks.forEach((element,index)=>{
      element.addEventListener('click',()=>{
            let utterance;
            if(element.id == "from") {
                utterance = new SpeechSynthesisUtterance(text_to_translate.value);
                utterance.lang = selects[0].value;
                utterance.pitch = .4;
                utterance.volume  = .8;
            } else {
                utterance = new SpeechSynthesisUtterance(text_translated.value);
                utterance.lang = selects[1].value;
                utterance.pitch = .6;
                utterance.volume  = .8;
            }
            speechSynthesis.speak(utterance);
      })
})

