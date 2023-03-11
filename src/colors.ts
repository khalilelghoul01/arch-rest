export class Colors {
  static readonly blue = "\x1b[34m";
  static readonly lightGreen = "\x1b[32m";
  static readonly lightRed = "\x1b[31m";
  static readonly lightYellow = "\x1b[33m";
  static readonly lightMagenta = "\x1b[5;35m";
  static readonly magenta = "\x1b[35m";
  static readonly lightCyan = "\x1b[36m";
  static readonly lightWhite = "\x1b[37m";
  static readonly reset = "\x1b[0m";

  static setBlue(text: string): string {
    return `${Colors.blue}${text}${Colors.reset}`;
  }

  static setLightGreen(text: string): string {
    return `${Colors.lightGreen}${text}${Colors.reset}`;
  }

  static setLightRed(text: string): string {
    return `${Colors.lightRed}${text}${Colors.reset}`;
  }

  static setLightYellow(text: string): string {
    return `${Colors.lightYellow}${text}${Colors.reset}`;
  }

  static setLightMagenta(text: string): string {
    return `${Colors.lightMagenta}${text}${Colors.reset}`;
  }

  static setLightCyan(text: string): string {
    return `${Colors.lightCyan}${text}${Colors.reset}`;
  }

  static setLightWhite(text: string): string {
    return `${Colors.lightWhite}${text}${Colors.reset}`;
  }

  static setReset(text: string): string {
    return `${Colors.reset}${text}${Colors.reset}`;
  }
}
