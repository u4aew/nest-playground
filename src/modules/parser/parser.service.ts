import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ParserService {
  constructor(private readonly configService: ConfigService) {}

  async parsePage(
    url: string,
    cookies?: Record<string, string>,
    prompt?: string,
  ): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Установить куки, если они предоставлены
    if (cookies) {
      const cookieArray = Object.entries(cookies).map(([name, value]) => ({
        name,
        value,
        domain: new URL(url).hostname,
      }));
      await page.setCookie(...cookieArray);
    }

    // Перейти на страницу
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Выполнить промпт, если он предоставлен
    if (prompt) {
      await page.evaluate((prompt) => {
        // Выполнить промпт в контексте страницы
        // Например, если промпт - это код JavaScript
        eval(prompt);
      }, prompt);
    }

    // Получить содержимое элемента с классом .crayons-article__main
    const content = await page.evaluate(() => {
      const element = document.querySelector('.crayons-article__main');
      return element ? element.innerHTML : 'Element not found';
    });

    await browser.close();
    return content;
  }
}
