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
var lang = false //0:English; 1:Chinese

function updateCounts(){
  eventCount = todos.length
  finishedCount = Object.values(todos).filter((a)=>a==0).length
  if(lang){
    $("eventCount").innerHTML = "您还有"+finishedCount+"件事要做！"
  }
  else{
    $("eventCount").innerHTML = "You have "+ finishedCount+" item"+autoPlural(finishedCount)+" to do!"
  }
}

function syncCookie(){
  for(todo in todos){
  document.cookie = todo+"="+todos[todo]+"; expires=Thu, 18 Dec 2043 12:00:00 GMT"
  }
}

function sliding(event){
  event.parentElement.appendChild()
}
function slidelete(e){
  var x = e.touches[0].clientX
  var node=document.createElement("div")
  node.setAttribute("style","float: right; height: 100%; width:"+(190-x)+";background-color:red;z-index:0;")
  //alert(event)
  /*if(Number(event.duration) > 10){ 
    //判断是左移还是右移，当偏移量大于10时执行
    if(event.endPos.x < -100){
      console.log(event.parentElement)
    }
  }*/
}

function toggleFinish(ev){
  var el = ev.srcElement
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
  node.innerHTML="<span>"+text+"</span><span class='toggler'>○</span>"
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

window.onload = function(){
  var ck = document.cookie.split("; ")
  var ia = []
  for(i in ck){
    ia = ck[i].split('=')
    todos[ia[0]]=parseInt(ia[1])
    var node=document.createElement("li")
    node.innerHTML="<span>"+ia[0]+"</span><span class='toggler'>"+(parseInt(ia[1])?"√":"○")+"</span>"+
      "<div class='deleting'></div>"
    node.setAttribute("class",parseInt(ia[1])?"finished":"unfinished")
    $("eventList").appendChild(node)
  }
  updateCounts()

  var a = $all("toggler")
  for(i=0;i<a.length;i++){
    a[i].addEventListener("click", function(){toggleFinish(event)})
  }
  a = $("eventList").children
  for(i=0;i<Object.values(a).length;i++){
    a[i].addEventListener("touchstart",function(){
      var ds = $all("deleting")
      for(i=0;i<ds.length;i++){
        ds[i].setAttribute("style","width:0;")
        ds[i].innerHTML=""
      }
    })
    a[i].addEventListener("touchmove", function (e){
      e.stopPropagation();
      if(e.target.lastChild.localName==="div"){
        console.log(e.target.lastChild)
        var x = e.touches[0].clientX
        if(e.target.clientWidth>275-x && x<275){
          var node = e.target.lastChild
          node.setAttribute("style","width:"+(275-x)+"px;")
          node.innerHTML="×"
        }
        else{
          var node = e.target.lastChild
          node.setAttribute("style","width:0;")
          node.innerHTML=""
          if(e.target.clientWidth<=275-x){
            delete todos[e.target.firstChild.innerHTML]
            document.cookie = e.target.firstChild.innerHTML+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
            e.target.remove()
            updateCounts()
          }
        }
      }
    })
  }
  document.cookie = "default_unit_second=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "NaN=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

document.addEventListener("click",function(){
  var ds = $all("deleting")
  for(i=0;i<ds.length;i++){
    ds[i].setAttribute("style","width:0;")
    ds[i].innerHTML=""
  }
})

$("langswc").addEventListener("click",function(){
  lang = !lang
  if(lang){
    $("theH1").innerHTML="待办"
    $("langswc").innerHTML="English"
    $("eventName").setAttribute("placeholder","想做什么？")
    if(Object.keys(todos).length===0){
      $("eventCount").innerHTML="恭喜！您还有0件事要做！"
    }
    else{
      updateCounts()
    }
  }
  else{
    $("theH1").innerHTML="TODOs"
    $("langswc").innerHTML="中文"
    $("eventName").setAttribute("placeholder","Planning what?")
    if(Object.keys(todos).length===0){
      $("eventCount").innerHTML="You have 0 item to do! Congratulations!"
    }
    else{
      updateCounts()
    }
  }
})
