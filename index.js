const button = document.getElementById("helloButton");
button.addEventListener(
  "click",
  function () {
    const paragraph = document.createElement("p");
    const text = document.createTextNode("Hello!!");
    paragraph.appendChild(text);
    document.body.appendChild(paragraph);
  },
  false
);
