M.Sidenav.init(document.querySelector(".sidenav"));
M.FormSelect.init(document.querySelector("#status "));

CKEDITOR.replace("body", {
  plugins: "wysiwygarea, toolbar, basicstyles, link" // what you see is what you get area [first letter of each word]
});