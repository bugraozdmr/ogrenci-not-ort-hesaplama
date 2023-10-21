// kullanilan tum elementler

const form = document.querySelector("#student-form");
const studentName = document.querySelector("#inputName3");
const studentSurname = document.querySelector("#inputSurname3");
const studentVize = document.querySelector("#inputVize3");
const studentFinal = document.querySelector("#inputFinal3");
// ul icine eklicez li'leri ondan lazim
const studentList = document.querySelector(".list-group");
// yukarda card-body ile alert cikarticaz
const secondCardBody = document.querySelectorAll(".card-body")[1];

const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-students");
const averageButton = document.querySelector("#average");


eventListeners();

function eventListeners(){
    form.addEventListener("submit",addStudent);
    document.addEventListener("DOMContentLoaded",loadAllStudentsToUI);
    secondCardBody.addEventListener("click",deleteStudent);
    filter.addEventListener("keyup",filterStudent);
    clearButton.addEventListener("click",clearAllStudent);
    averageButton.addEventListener("click",calculateAvg);
}


//! average

function calculateAvg(){
    let students = getStudentFromStorage();

    while(studentList.firstElementChild != null){
        studentList.removeChild(studentList.firstElementChild);
    }

    // sayfa yenilenince gider
    // daha da ugrasmak istemedim
    students.forEach(function(e){
        // Dizeyi '/' karakterine göre bölelim
        var parts = e.split('/');

        // parts dizisindeki sayıları alalım
        var vize = parseInt(parts[2].trim());
        var final = parseInt(parts[3].trim());

        var name = parts[0].trim();
        var surname = parts[1].trim();

        //ort hesap

        let avg = vize*4/10+final*6/10;



        const listItem = document.createElement("li");
        const link = document.createElement("a");

        // ListItem olusturma
        listItem.className = "list-group-item d-flex justify-content-between";
        // text node
        let text = `${name} ${surname} = ${avg.toFixed(2)}`;
        listItem.appendChild(document.createTextNode(text));
        // yine append child link
        listItem.appendChild(link);


        // LINK olusturma
        link.href = "#";
        link.className = "delete-item";
        // icindeki html islemini ic html olarak aldik
        link.innerHTML = '<i class = "fa fa-remove"></i>';

        // student list'e list Item'i ekleme
        // student list --> ul zaten
        studentList.appendChild(listItem);
        
    });
}



//! clear them all

function clearAllStudent(){
    if(confirm("Tumunu silmek istedigine emin misin ?")){
        //arayuzden todolari temizleme
        // todoList.innerHTML = "";    //yavas

        // console.log(todoList.firstElementChild);

        // eger firstelementchild yoksa null doner
        //art arta kullanarak silme yapacak
        while(studentList.firstElementChild != null){
            studentList.removeChild(studentList.firstElementChild);
        }
        // key vererek sildik
        showAlert("tum tasklar silindi","warning");
        localStorage.removeItem("students");
    }
}




//!ogrenci arama

function filterStudent(e){
    // e basilan tuş onu direkt kucuk harfe çeviriyor
    const filterValue = e.target.value.toLowerCase();
    
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(item){
        const text = item.textContent.toLowerCase();

        // geciyorsa index doner gecmezse -1 doner
        if(text.indexOf(filterValue) === -1){
            //Bulamadi
            // gozukmesin o zman
            // css'de oncelik ver dedik bu kesin calissin
            // yoksa bootsrap'deki ozellik caliyordu todolar gitmiyordu
            item.setAttribute("style","display:none !important");
        }
        else {
            item.setAttribute("style","display:block");
        }


    });
}



//! load etme
// adamsın gpt
// undefine alıyorduk surekli ancak gpt cozdu
function loadAllStudentsToUI(e){
    let students = getStudentFromStorage();
    students.forEach(function(student){
        const [name, surname, vize, final] = student.split('/');
        addStudentToUI(name, surname, vize, final);
    });
}


//!remove

function deleteStudent(e){
    if(e.target.className === "fa fa-remove"){
        // iki kere yukari cikip parenti bulmak lazim
        e.target.parentElement.parentElement.remove();
        deleteStudentFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("Öğrenci silindi","warning");
    }
}


//!remove from storage

function deleteStudentFromStorage(delStudent){
    let students = getStudentFromStorage();

    students.forEach(function(student,index){
        if(student === delStudent){
            // splice metodu kullanilir
            students.splice(index,1);
        }
    });


    localStorage.setItem("students",JSON.stringify(students));

    //console.log("islem tamam");
}



function addStudent(e){
    // text strim bosluklari temizler
    const name = studentName.value.trim();
    const surname = studentSurname.value.trim();
    const vize = studentVize.value.trim();
    const final = studentFinal.value.trim();

    if((name === "") && (surname === "") && (vize === "") && (final === "")) {
        showAlert("Lutfen Öğrenci Bilgisi Girin !", "danger");
    }
    else if((name === "") || (surname === "") || (vize === "") || (final === "")){
        showAlert("Doldurulmamış alanlar var!", "danger");
    }
    
    else {
        //* cok sayida kontrol ile nasıl alınması gerektiği çözüldü


        //* vize sayisal mi degil mi kontrol
        if ((!isNumeric(vize)) || (!isNumeric(final))) {
            showAlert("Vize ve Final Değeri Sayısal Olmalıdır.","warning");
        } 
        else {
            // Sayıyı tamsayıya çevirin
            const vize1 = parseInt(vize, 10);
            const final1 = parseInt(final, 10);

            // 0 ile 100 arasında olup olmadığını kontrol edin
            if ((vize1 >= 0 && vize1 <= 100) && (final1 >= 0 && final1 <= 100)) {
                addStudentToUI(name,surname,vize,final);
                addStudentToStorage(name,surname,vize,final);
                showAlert("Öğrenci ekleme başarılı","success");       
            } 
            else {
                showAlert("Vize Değeri 0-100 arasında olmalıdır.","warning");
            }
        }

    // sayfa yenilenmesini önlemek lazım
    e.preventDefault();
}
}


function isNumeric(text) {
    return !isNaN(text) && isFinite(text);
}



function addStudentToUI(name,surname,vize,final){
    // mentor kod bu
    // <li class="list-group-item d-flex justify-content-between">
    //                         Todo 1
    //                         <a href = "#" class ="delete-item">
    //                             <i class = "fa fa-remove"></i>
    //                         </a>

    // </li> 

    //icindeki textide almak lazim


    const listItem = document.createElement("li");
    const link = document.createElement("a");

    // ListItem olusturma
    listItem.className = "list-group-item d-flex justify-content-between";
    // text node
    let text = `${name} / ${surname} / ${vize} / ${final}`;
    listItem.appendChild(document.createTextNode(text));
    // yine append child link
    listItem.appendChild(link);


    // LINK olusturma
    link.href = "#";
    link.className = "delete-item";
    // icindeki html islemini ic html olarak aldik
    link.innerHTML = '<i class = "fa fa-remove"></i>';

    // student list'e list Item'i ekleme
    // student list --> ul zaten
    studentList.appendChild(listItem);

    //ekleme sonrasi todo value bosaltilsin

    studentName.value = "";
    studentSurname.value = "";
    studentVize.value = "";
    studentFinal.value = "";
}


function addStudentToStorage(name,surname,vize,final){
    let students = getStudentFromStorage();
    let text = `${name} / ${surname} / ${vize} / ${final}`;
    // yeni ogrenci olussun
    students.push(text)

    localStorage.setItem("students",JSON.stringify(students));
}


//! cokca yerde kullanilacagi icin fonk yaptik
function getStudentFromStorage(){
    let students;
    
    if(localStorage.getItem("students") === null){
        students = [];
    }
    else{
        students = JSON.parse(localStorage.getItem("students"));
    }

    //console.log(students);
    return students;
}



// Alert eklemek için JavaScript kullanımı
// gpt kullanabilene harika
function showAlert(message, alertType) {
    var alertContainer = document.getElementById("alert-container");
    var alertDiv = document.createElement("div");
    
    // farkli şeyler denemek istedim mesela basınca alert kapancaktı vs ama olmadı

    alertDiv.className = "alert alert-" + alertType + " alert-dismissible fade show";
    alertDiv.innerHTML = message;

    alertContainer.appendChild(alertDiv);


    // Belirli bir süre sonra alerti otomatik olarak kaldırmak için
    setTimeout(function() {
        alertDiv.remove();
    }, 2000);
    
    
}

