let time = document.getElementById('sale');
let initialTime = 11;
let timeArray = [];
for (let i = 1; i < 30; i++) {
  timeArray[i] = new Date(2019, 3, initialTime);
  initialTime += 14;
}

let now = Date.now();
for (let i = 0; i < timeArray.length; i++) {
  if (now < +timeArray[i]) {
    now = timeArray[i];
    break;
  }
}

time.innerText = `Акция действует до ${now.getDate()} ${month(now.getMonth())}!`;

function month(m) {
  switch (m) {
    case 0:
      return 'Января';
    case 1:
      return 'Февраля';
    case 2:
      return 'Марта';
    case 3:
      return 'Апреля';
    case 4:
      return 'Мая';
    case 5:
      return 'Июня';
    case 6:
      return 'Июля';
    case 7:
      return 'Августа';
    case 8:
      return 'Сентября';
    case 9:
      return 'Октября';
    case 10:
      return 'Ноября';
    case 11:
      return 'Декабря';
  }
}
