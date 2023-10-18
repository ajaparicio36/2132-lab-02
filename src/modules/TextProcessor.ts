import { CaesarCipher } from "./DecoratorCipher";

interface TextProcessor {
  processText(text: string | { [key: string]: string }): void;
}

export class LegacyTextProcessor implements TextProcessor {
  processText(text: string) {
    const pattern =
      /^([A-Za-z]{4})(\d{3})\|(\d{10})\|(\d{10})\|(\d{2}\d{2}\d{4})$/;

    const matches = pattern.exec(text);

    if (matches) {
      const [
        ,
        promo_code,
        promo_number,
        originating_number,
        destination_number,
        date,
      ] = matches;

      const promo_code_encrypted = CaesarCipher.encrypt(promo_code)
      const promo_number_encrypted = CaesarCipher.encrypt(promo_number)
      const originating_number_encrypted = CaesarCipher.encrypt(originating_number)
      const destination_number_encrypted = CaesarCipher.encrypt(destination_number)
      const date_encrypted = CaesarCipher.encrypt(date)

      console.log([
        promo_code_encrypted,
        promo_number_encrypted,
        originating_number_encrypted,
        destination_number_encrypted,
        date_encrypted,
      ]);
    }
  }
}

export class NewTextProcessor implements TextProcessor {
  processText(text: { [key: string]: string }) {
    const formattedData: { [key: string]: string } = {
      promo_code: "",
      promo_number: "",
      originating_number: "",
      destination_number: "",
      date: "",
    };

    for (const key of Object.keys(text)) {
      if (!(key in formattedData)) {
        break;
      } else {
        for (const key of Object.keys(text)) {
          formattedData[key] = text[key];
        }

        Object.entries(text).forEach(([key, value]) => {
          console.log(`${key}: ${CaesarCipher.encrypt(value)}`);
        });
        break;
      }
    }
  }
}

export class TextProcessorAdapter implements TextProcessor {
  private processors: TextProcessor[] = [];

  addProcessor(processor: TextProcessor) {
    this.processors.push(processor);
  }

  processText(text: string | { [key: string]: string }) {
    for (const processor of this.processors) {
      processor.processText(text);
    }
  }
}
