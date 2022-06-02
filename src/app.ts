import * as fs from 'fs'
import { webkit } from 'playwright';

const DATA_PATH = "./public/data.json";

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 設定しているURLにアクセスする
  await page.goto('https://www.speedrun.com/mdread');
  const data = await page.evaluate(() => {
    const leaderboard = document.querySelector("#primary-leaderboard");
    if (!leaderboard) return;

    const rows = leaderboard.querySelectorAll("tr");
    if (!rows || rows.length === 0) return;
    const row_array = Array.from(rows);
  
    row_array.shift(); // remove header row

    return row_array.map((row) => {
      const user_name = (row.querySelector(".username") as HTMLInputElement)?.innerText || "";
      const real_time = row.querySelectorAll('td')[2].innerText;
      const in_game_time = row.querySelectorAll('td')[3].innerText;
      const difficulty = row.querySelectorAll('td')[5].innerText;
      row.querySelectorAll('td')[5].innerText
      return { user_name, real_time, in_game_time, difficulty };
    });
  });

  console.log(data);

  // ブラウザを閉じる
  await browser.close();

  fs.writeFileSync(DATA_PATH, JSON.stringify(data), "utf8");
})();
