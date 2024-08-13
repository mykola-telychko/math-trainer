// sample: https://codepen.io/davebitter/pen/VweaZqY

// Set default values
document.getElementById('aa').value=Math.floor(Math.random() * 8) + 2;

document.getElementById('bb').value=Math.floor(Math.random() * 8) + 2;

document.getElementById('operator').value=["*",":"][Math.round(Math.random())]


// console.log('firstVal');
// Elements
const numberCodeForm = document.querySelector('[data-number-code-form]');
// array of elements
// const numberCodeInputs = [...numberCodeForm.querySelectorAll('[data-number-code-input]')];


// Event callbacks
// here constraint length
// const handleInput = ({target}) => {
//   if (!target.value.length) { return target.value = null; }
  
//   const inputLength = target.value.length;
//   let currentIndex = Number(target.dataset.numberCodeInput);
  
//   if (inputLength > 1) {
//     const inputValues = target.value.split('');
    
//     inputValues.forEach((value, valueIndex) => {
//       const nextValueIndex = currentIndex + valueIndex;
      
//       if (nextValueIndex >= numberCodeInputs.length) { return; }
      
//       numberCodeInputs[nextValueIndex].value = value;
//     });
    
//     currentIndex += inputValues.length - 2;
//   }
 
//   const nextIndex = currentIndex + 1;
  
//   if(nextIndex < numberCodeInputs.length) {
//     numberCodeInputs[nextIndex].focus();
//   }
// }

const handleKeyDown = e => {
  const {code, target} = e;
  
  const currentIndex = Number(target.dataset.numberCodeInput);
  const previousIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;
  
  const hasPreviousIndex = previousIndex >= 0;
  const hasNextIndex = nextIndex <= numberCodeInputs.length - 1
  
//   switch(code) {
//     case 'ArrowLeft':
//     case 'ArrowUp':
//       if (hasPreviousIndex) {
//         numberCodeInputs[previousIndex].focus();
//       }
//       e.preventDefault();
//       break;
      
//     case 'ArrowRight':
//     case 'ArrowDown':
//       if (hasNextIndex) {
//         numberCodeInputs[nextIndex].focus();
//       }
//       e.preventDefault();
//       break;
//     case 'Backspace':
//       if (!e.target.value.length && hasPreviousIndex) {
//         numberCodeInputs[previousIndex].value = null;
//         numberCodeInputs[previousIndex].focus();
//       }
//       break;
//     default:
//       break;
//   }
}

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    const aa = document.getElementById('aa').value;
    const bb = document.getElementById('bb').value;
    const myResult = parseInt(document.getElementById('result').value);
    const operator = document.getElementById('operator').value;
  
  let correctResult
  if (operator == '*') {
      correctResult = aa * bb;
        console.log(aa, bb, correctResult, myResult, correctResult == myResult);
  } else {
      correctResult = aa / bb;
        console.log(aa, bb, correctResult, myResult, correctResult == myResult);
  }
    // console.log(aa, bb, operator);
  
  
    // Display the result
    // document.getElementById('result').innerHTML = `
    //     <h2>Submitted Data:</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    // `;

    // Optionally, you can handle the data here (e.g., send it to a server)
});


// Event listeners
// numberCodeForm.addEventListener('input', handleInput);
// numberCodeForm.addEventListener('keydown', handleKeyDown);

