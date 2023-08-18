let addBtn=document.querySelector('.add-btn')
let modalCont=document.querySelector('.modal-cont')
let mainCont=document.querySelector('.main-cont')
let textareaCont=document.querySelector('.textArea-cont')
let allPriorityColors=document.querySelectorAll('.priority-color')
let colors=["lightpink" ,"lightgreen", "lightblue" , "black"]
let modalPrioritycolor= colors[colors.length-1]

let toolBoxColors=document.querySelectorAll('.color')

let ticketsArr=[]





let removeBtn=document.querySelector('.remove-btn')
let removeTaskFlag=false



let lockClass='fa-lock'
let unlockClass='fa-lock-open'



let addTaskFlag=false;
console.log(addTaskFlag)

if(localStorage.getItem('tickets')){
    ticketsArr=JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketcolor,ticket.ticketTask,ticket.ticketID)
    })
}





allPriorityColors.forEach(function(colorElem){
colorElem.addEventListener('click' , function(){
    allPriorityColors.forEach(function(prioritycolorElem){
        prioritycolorElem.classList.remove('active')
    })
    colorElem.classList.add('active')
    modalPrioritycolor=colorElem.classList[0]
})
})


addBtn.addEventListener('click',function(){
    addTaskFlag=!addTaskFlag

    if(addTaskFlag==true){
   modalCont.style.display='flex'
    }

    else{
        modalCont.style.display='none'
    }

})


removeBtn.addEventListener('click' , function(){
    removeTaskFlag = !removeTaskFlag

    if(removeTaskFlag==true){
        alert('delete button has been activated')
        removeBtn.style.color = 'red'
    }
    else{
        removeBtn.style.color = 'white'
    }
})


modalCont.addEventListener('keydown' , function(e){
    let key=e.key

    if(key==='Shift'){
        createTicket(modalPrioritycolor,textareaCont.value)
        modalCont.style.display='none'
        textareaCont.value=''
    }
})

function createTicket(ticketcolor,ticketTask,ticketID){
    let id= ticketID || shortid();
    let ticketCount=document.createElement('div')
    ticketCount.setAttribute('class' ,'ticket-cont')

    ticketCount.innerHTML = ` 
    <div class="ticket-color  ${ticketcolor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
</div>

    `;
mainCont.appendChild(ticketCount)
handleRemoval(ticketCount,id)
handlelock(ticketCount,id)
handleColor(ticketCount,id)
if(!ticketID){
ticketsArr.push(
    {
        ticketcolor,ticketTask,ticketID:id
    }
)
localStorage.setItem('tickets' ,JSON.stringify(ticketsArr))
}
}



function handleRemoval(ticket,id){
    ticket.addEventListener('click' , function(){
        if(!removeTaskFlag) return
        let idx=getTicketIdx(id)
        ticket.remove()

        let deletedElement=ticketsArr.splice(idx,1)

        localStorage.setItem('tickets' , JSON.stringify(ticketsArr))
    })
}

function handlelock(ticket,id){
  let ticketTaskArea=ticket.querySelector('.task-area')
    let ticketLockElem=ticket.querySelector('.ticket-lock')
    let ticketLockIcon=ticketLockElem.children[0]

    ticketLockIcon.addEventListener('click' , function(){
        let ticketIdx=getTicketIdx(id)
   
       if (ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.remove(lockClass)
            ticketLockIcon.classList.add(unlockClass)
            ticketTaskArea.setAttribute('contenteditable', true)
        }
       
        else{
            ticketLockIcon.classList.remove(unlockClass)
            ticketLockIcon.classList.add(lockClass)
            ticketTaskArea.setAttribute('contenteditable', false)
           
        }

        ticketsArr[ticketIdx].ticketTask=ticketTaskArea.innerText
        localStorage.setItem('tickets' , JSON.stringify(ticketsArr))

    })
}

function handleColor(ticket , id){

     
    let ticketColorBand = ticket.querySelector('.ticket-color')

    ticketColorBand.addEventListener('click' , function(){
        let ticketIdx=getTicketIdx(id)
    
        let currentColor = ticketColorBand.classList[1]

        let currentColorIdx = colors.findIndex(function(color){
            return currentColor === color
        })

        currentColorIdx++

        let newTicketColorIdx = currentColorIdx % colors.length

        let newTicketColor = colors[newTicketColorIdx]

        ticketColorBand.classList.remove(currentColor)
        ticketColorBand.classList.add(newTicketColor)

        ticketsArr[ticketIdx].ticketcolor=newTicketColor
       localStorage.setItem('tickets' , JSON.stringify(ticketsArr))         
    })


}

for(let i=0 ; i<toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener('click' , function(){
        let selectedToolBoxColor = toolBoxColors[i].classList[0]

        let filterdTickets = ticketsArr.filter(function(ticket){
            return selectedToolBoxColor === ticket.ticketcolor
        })

        console.log(filterdTickets)

        let allTickets = document.querySelectorAll('.ticket-cont')

        for(let i=0 ; i<allTickets.length ; i++){
            allTickets[i].remove()
        }


        filterdTickets.forEach(function(filterdTicket){
            createTicket(
                filterdTicket.ticketcolor , filterdTicket.ticketTask , filterdTicket.ticketID
            )

        })
        
 })

 toolBoxColors[i].addEventListener("dblclick", function () {
    let allTickets = document.querySelectorAll(".ticket-cont");

    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }

    ticketsArr.forEach(function (ticketObj) {
      createTicket(
        ticketObj.ticketcolor,
        ticketObj.ticketTask,
        ticketObj.ticketID
      );
    });
  });
}


function getTicketIdx(id){
    let ticketIdx=ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketID === id
    })
    return ticketIdx
}
