import puppeteer from "puppeteer";
import * as fs from "fs/promises";
import * as path from "path";

import { dequeue } from "./database.js";

const ORIGIN = process.env.ORIGIN ?? "http://localhost:4000";
const FLAG = process.env.FLAG ?? "picoCTF{copilot_says_bongo_cat_is_awesome}";

const bongoCat = (await fs.readFile(path.resolve("./bongo-cat.json"))).toString("utf8");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const visitOne = async () => {
    const url = await dequeue();
    if (url === undefined) {
        await sleep(500);
        return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(ORIGIN);
    await page.evaluate(([bongoCat, flag]) => {
        localStorage.setItem("image", bongoCat);
        localStorage.setItem("username", flag);
    }, [bongoCat, FLAG]);

    await Promise.race([
        page.goto(url),
        sleep(3000),
    ]);
    await sleep(3000);

    await browser.close();
}

export const startVisiting = async () => {
    while (true) {
        await visitOne();
    }
}

