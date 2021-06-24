function $(q){
  return document.getElementById(q)
}
function $all(q){
  return document.getElementsByClassName(q)
}
function autoPlural(num){
  if(num>1)
    return "s"
  return ""
}

var eventCount = 0
var finishedCount = 0
var todos = new Object()

function updateCounts(){
  eventCount = todos.length
  finishedCount = Object.values(todos).filter((a)=>a==0).length
  $("eventCount").innerHTML = "You have "+ finishedCount+" item"+autoPlural(finishedCount)+" to do!"
}

function syncCookie(){
  for(todo in todos){
  document.cookie = todo+"="+todos[todo]+"; expires=Thu, 18 Dec 2043 12:00:00 GMT"
  }
}

function readCookie(){
  var ck = document.cookie.split(";")
  console.log(ck)
}

function toggleFinish(ev){
  var el = ev.srcElement
  console.log(el.parentElement)
  if(el.parentElement.getAttribute("class").includes("unfinished")){
    el.innerHTML="√"
    el.parentElement.setAttribute("class","finished")
    todos[el.offsetParent.childNodes[0].innerHTML]=1
    updateCounts()
    syncCookie()
  }
  else{
    el.innerHTML="○"
    el.parentElement.setAttribute("class","unfinished")
    todos[el.offsetParent.childNodes[0].innerHTML]=0
    updateCounts()
    syncCookie()
  }
}

function addTodo(){
  var text = document.getElementById("eventName").value
  if(!text){
    alert("An event must have a name!")
    return
  }
  var node=document.createElement("li")
  node.innerHTML="<span>"+text+"</span><span class='toggler unfinished'>○</span>"
  node.setAttribute("class","unfinished")
  $("eventList").appendChild(node)
  $("eventName").value=""
  todos[text] = 0
  updateCounts()
  syncCookie()

  var a = $all("toggler")
  a[a.length-1].addEventListener("click", function(){toggleFinish(event)})
}

$("eventName").addEventListener("keyup",function(event){
  if(event.keyCode==13){
    addTodo()
  }
})

//清除所有cookie函数
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if(keys) {
    for(var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

