

setTimeout(function() {
var typingBool1 = false; 
var typingIdx1 = 0; 
var typingTxt1 = $(".typing-txt-1").text(); 

typingTxt1 = typingTxt1.split("");
if( typingBool1 == false ){
   typingBool1=true; 
       
   var tyInt = setInterval(typing1,100);
} 
     
function typing1(){ 
    if( typingIdx1 < typingTxt1.length ){
        $(".typing-1").append(typingTxt1[typingIdx1]);
        typingIdx1++; 
    }
    else { 
        clearInterval(tyInt);
    }   
}
}, 1000);

setTimeout(function() {

var typingBool2 = false; 
var typingIdx2 = 0; 
var typingTxt2 = $(".typing-txt-2").text();

typingTxt2 = typingTxt2.split("");
if( typingBool2 == false ){
   typingBool2=true; 
       
} 
if(typingBool2 == true){
	 var tyInt = setInterval(typing2,100);
}  
function typing2(){ 
    if( typingIdx2 < typingTxt2.length ){
        $(".typing-2").append(typingTxt2[typingIdx2]);
        typingIdx2++; 
    }
    else { 
        clearInterval(tyInt);
    }   
}
}, 9000);