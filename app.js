// Kết nối realtime
let socket = null

try{
socket = io()
}catch(e){
console.log("Socket chưa bật")
}

// admin mode
let isAdmin = false


// load danh sách bàn
async function loadTables(){

const res = await fetch("/tables")
const tables = await res.json()

renderTables(tables)

}


// render bàn ra giao diện
function renderTables(tables){

const container = document.getElementById("tables")

if(!container) return

container.innerHTML=""

tables.forEach(t=>{

const div = document.createElement("div")

div.className="table"

if(t.status==="free") div.style.background="green"
if(t.status==="occupied") div.style.background="red"
if(t.status==="reserved") div.style.background="orange"

div.innerText="Bàn "+t.id

div.onclick = ()=> tableClick(t.id)

container.appendChild(div)

})

}


// click bàn
async function tableClick(id){

if(!isAdmin){
alert("Chỉ admin mới đổi trạng thái bàn")
return
}

await fetch("/update-table",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({id})
})

loadTables()

}


// login admin
function login(){

const pass = prompt("Nhập mật khẩu admin")

if(pass==="1234"){
isAdmin = true
alert("Đã vào chế độ admin")
}else{
alert("Sai mật khẩu")
}

}


// realtime update
if(socket){

socket.on("tables-update",(tables)=>{
renderTables(tables)
})

}


// load khi trang mở
window.onload = ()=>{
loadTables()
}