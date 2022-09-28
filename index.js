// console.log("Hare Krishna");

const birthInput = document.querySelector('#date-input');
const btnContainer = document.querySelector('.btn-container');
const output = document.querySelector('.output-section');
const alertText = document.querySelector('.alert');

function alertMsg(type, msg, ms) {
  const tID = setInterval(() => {
    alertText.innerText = msg;
    alertText.classList.add(`alert-${type}`);
    alertText.classList.add('show-alert');
  }, 0);

  setTimeout(() => {
    clearInterval(tID);
    alertText.classList.remove(`alert-${type}`);
    alertText.classList.remove('show-alert');
  }, ms);
}

function lessThan10(thingToCheck) {
  return thingToCheck < 10 ? '0' + thingToCheck : `${thingToCheck}`;
}

function checkPalindrome(dateArr) {
  const dateValues = dateArr.join('');
  const reversedDateValues = dateArr.join('').split('').reverse().join('');
  return dateValues === reversedDateValues;
}

function getAllDateFormats({ day, month, year }) {
  const slicedYY = year.slice(-2, year.length);
  const ddMMYYYY = `${day}-${month}-${year}`;
  const MMddYYYY = `${month}-${day}-${year}`;
  const YYYYMMdd = `${year}-${month}-${day}`;
  const ddMMYY = `${day}-${month}-${slicedYY}`;
  const MMddYY = `${month}-${day}-${slicedYY}`;
  const YYMMdd = `${slicedYY}-${month}-${day}`;
  return [
    { ddMMYYYY },
    { MMddYYYY },
    { YYYYMMdd },
    { ddMMYY },
    { MMddYY },
    { YYMMdd },
  ];
}

function getPalindromeCheckedFormats(allFormats) {
  return allFormats
    .filter((item) => {
      return checkPalindrome(Object.values(item)[0].split('-'));
    })
    .map((single) => {
      return {
        format: Object.keys(single)[0],
        valueStr: Object.values(single)[0],
      };
    });
}

function displayOutput(
  msg,
  mainDateObj,
  nearestDateIfExists,
  dateArrContainObj,
  diff
) {
  const myBirthDate = [...Object.values(mainDateObj)].join('-');
  const condn = msg.startsWith('Cong');
  output.innerHTML = `
    <span style='color:${condn ? 'green' : 'red'}'>
    ${condn ? msg : 'Sorry'}
    </span>
     your birthday ${myBirthDate} is ${condn ? '' : 'not'} palindrome ${
    condn
      ? ''
      : `and the nearest palindrome date is ${[
          ...Object.values(nearestDateIfExists),
        ].join('-')}`
  } by
    ${dateArrContainObj
      .map((item, i) => {
        return `
        <br />
        ${dateArrContainObj.length > 1 ? i + 1 : ''}. 
        <span style='color:${condn ? 'green' : 'red'}'>
        ${item.valueStr}
        </span> 
        of
       <span style='color:#222'>
       (${item.format})
       </span> format`;
      })
      .join(', ')} ${
    condn
      ? '🎉🎊'
      : `😢.<br /> You missed it by 
      <span style='color: red'>
      ${Math.floor(diff)} day${Math.floor(diff) === 1 ? '' : 's'}
      </span>`
  }
    `;
}

function getPreviousPalindrome(
  [currentDate, currentMonth, currentYear],
  presentDate
) {
  for (let k = currentDate - 1; true; k--) {
    const newDate = new Date(currentYear, currentMonth - 1, k);
    const prevNewDateObj = makeDateObj(newDate);
    const prevNewDateIsPalindromeArr =
      getsAllFormatThenChecksPalindromeForAllFormats(prevNewDateObj);

    // console.log(prevNewDateObj);
    if (prevNewDateIsPalindromeArr.length) {
      const prevDiffBetnTwo =
        (presentDate.getTime() - newDate.getTime()) / (1000 * 60 * 60 * 24);

      return [
        'prev',
        presentDate,
        prevNewDateObj,
        prevNewDateIsPalindromeArr,
        prevDiffBetnTwo,
      ];
    }
  }
}

function getNextPalindrome(
  [currentDate, currentMonth, currentYear],
  presentDate
) {
  for (let i = currentDate + 1; true; i++) {
    const newDate = new Date(currentYear, currentMonth - 1, i);
    const nextNewDateObj = makeDateObj(newDate);
    const nextNewDateIsPalindromeArr =
      getsAllFormatThenChecksPalindromeForAllFormats(nextNewDateObj);

    if (nextNewDateIsPalindromeArr.length) {
      const nextDiffBetnTwo =
        (newDate.getTime() - presentDate.getTime()) / (1000 * 60 * 60 * 24);
      return [
        'next',
        presentDate,
        nextNewDateObj,
        nextNewDateIsPalindromeArr,
        nextDiffBetnTwo,
      ];
    }
  }
}

function nearestPalindrome(presentModifiedDate, presentUnmodifiedDate) {
  const current = [...Object.values(presentModifiedDate)].map((item) => {
    return Number(item);
  });

  const prevArgs = getPreviousPalindrome(current, presentUnmodifiedDate);
  const nextArgs = getNextPalindrome(current, presentUnmodifiedDate);

  if (prevArgs[prevArgs.length - 1] > nextArgs[nextArgs.length - 1]) {
    displayOutput(...nextArgs);
  } else {
    displayOutput(...prevArgs);
  }
}

function makeDateObj(date) {
  return {
    day: `${lessThan10(date.getDate())}`,
    month: `${lessThan10(date.getMonth() + 1)}`,
    year: `${date.getFullYear()}`,
  };
}

function getsAllFormatThenChecksPalindromeForAllFormats(date) {
  const allDateFormats = getAllDateFormats(date);
  const palindromeCheckedFormatsObjInArr =
    getPalindromeCheckedFormats(allDateFormats);
  return palindromeCheckedFormatsObjInArr;
}

function handleContainerClick(e) {
  e.preventDefault();
  if (!('btn' in e.target.dataset)) {
    return;
  }

  const btnClicked = e.target.dataset.btn;
  const birthDate = birthInput.valueAsDate;

  if (btnClicked === 'clear') {
    birthInput.value = '';
    output.innerText = '';
    alertMsg('success', 'Cleared', 1000);
    return;
  }

  if (!birthInput.value) {
    alertMsg('danger', 'Please enter your birthdate 🙏', 1000);
    return;
  }

  const dateObj = makeDateObj(birthDate);

  const palindromeCheckedFormatsObjInArr =
    getsAllFormatThenChecksPalindromeForAllFormats(dateObj);
  if (palindromeCheckedFormatsObjInArr.length) {
    displayOutput(
      'Congratulations',
      dateObj,
      undefined,
      palindromeCheckedFormatsObjInArr,
      undefined
    );
  } else if (!palindromeCheckedFormatsObjInArr.length) {
    // displayOutput(nextPalindromeDate);
    nearestPalindrome(dateObj, birthDate);
  }

  alertMsg('success', 'Done ✅', 1000);
}

btnContainer.addEventListener('click', handleContainerClick);

document.querySelector('input').addEventListener('click', () => {
  output.innerText = '';
});
