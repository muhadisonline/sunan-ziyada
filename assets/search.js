
var AR="٠١٢٣٤٥٦٧٨٩";
function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function west(s){return String(s).replace(/[٠-٩]/g,function(d){return AR.indexOf(d)})}
function norm(s){return String(s).replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/\s+/g," ").trim()}
function esc(s){return String(s).replace(/&/g,"&").replace(/</g,"<")}
var box=document.getElementById("hits"), status=document.getElementById("status"), input=document.getElementById("q");
var rows=null;
function run(){
  var q=west(input.value).trim();
  if(!q){status.textContent="";box.innerHTML="";return}
  status.textContent="…";
  var go=function(){
    var hits=[];
    if(/^\d+$/.test(q)){
      var no=+q;
      for(var i=0;i<rows.length && hits.length<40;i++) if(rows[i][1]===no) hits.push(rows[i]);
    } else {
      var nq=norm(q);
      if(nq.length<2){status.textContent="حرفان على الأقل";box.innerHTML="";return}
      for(var j=0;j<rows.length && hits.length<40;j++) if(rows[j][4].indexOf(nq)!==-1) hits.push(rows[j]);
    }
    status.textContent=hits.length? ar(hits.length)+" نتيجة"+(hits.length>=40?" — أول أربعين":""):"لا يوجد حديث مطابق";
    box.innerHTML=hits.map(function(h){return '<a href="../'+h[0]+'/'+h[1]+'/"><span class="hit-no">'+esc(h[2])+' · الحديث '+ar(h[1])+'</span>'+esc(h[3])+'</a>'}).join("");
  };
  if(rows) go(); else fetch("../assets/search-index.json").then(function(r){return r.json()}).then(function(d){rows=d;go()});
}
document.getElementById("f").addEventListener("submit",function(e){e.preventDefault();run(); history.replaceState(null,"","?q="+encodeURIComponent(input.value))});
var m=location.search.match(/[?&]q=([^&]+)/); if(m){input.value=decodeURIComponent(m[1]); run();}
