import { CheerioAPI, load } from "cheerio";

export function parseDate(date: Date): string {
    let string: String = (date.toLocaleDateString('ko-KR', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }));
    return string.replace(/ /g, "-").replace(/\./g, "");
}

export class ritdata {
  public tijd: number;
  public afstand: number;
  public matnummer!: String;
  public ritnummer: number;
  public ritserie: number;
  public starttijd: string;
  public eindtijd: string;
  public planStarttijd: string;
  public planEindTijd: string;
  public starttijdUnix: number;
  public eindtijdUnix: number;
  public planStarttijdUnix: number;
  public planEindTijdUnix: number;
  public startPunt: string;
  public startPuntSpoor: number;
  public eindPunt: string;
  public eindPuntSpoor: number;
  public startVertraging: number;
  public eindVertraging: number;

  constructor(html: string, date: Date) {
    var element = load(html, null, false);
    this.ritnummer = parseInt(element('td:nth-of-type(1)>a').text());
    this.ritserie = 100*Math.floor(this.ritnummer/100);
    this.tijd = parseInt((element('td:nth-of-type(3)').html() as string).split("<br>")[1].split(":")[0])*60 + parseInt((element('td:nth-of-type(3)').html() as string).split("<br>")[1].split(":")[1])
    this.afstand = parseInt((element('td:nth-of-type(3)').html() as string).split("<br>")[0].replace(" km", ""));
    let splitInfo = (element('td:nth-of-type(2)').html() as string).split(/<span([^>])*>|<\/span>/g);
    splitInfo = splitInfo.slice(2);
    this.startPuntSpoor = parseInt(splitInfo[0]);
    this.startPunt = splitInfo[2].replace(/[0-9]{2}:[0-9]{2} |<br>/g, "").replace(/ \B/, "");
    let planStarttijd = splitInfo[2].split("", 5).join("");
    this.planStarttijd = planStarttijd;
    this.planStarttijdUnix = date.setHours(parseInt(planStarttijd.split(":")[0]), parseInt(planStarttijd.split(":")[1])).valueOf();
    this.startVertraging = 0;
    let startHasDelay = 0;
    if(splitInfo[4].includes("+")) {
      this.startVertraging = parseInt(splitInfo[4].replace(/&nbsp;|\+/g, ""));
      startHasDelay = 4;
    }
    let delayedStartTime = new Date(date.setHours(parseInt(planStarttijd.split(":")[0]), parseInt(planStarttijd.split(":")[1])+this.startVertraging));
    this.starttijdUnix = delayedStartTime.valueOf();
    this.starttijd = delayedStartTime.getHours() + ":" + delayedStartTime.getMinutes();


    this.eindPuntSpoor = parseInt(splitInfo[4+startHasDelay]);
    //console.log(splitInfo, this.eindPuntSpoor)
    this.eindPunt = splitInfo[2+4+startHasDelay].replace(/[0-9]{2}:[0-9]{2} |<br>/g, "").replace(/ \B/, "");;
    let planeindtijd = splitInfo[2+4+startHasDelay].split("", 5).join("");
    this.planEindTijd = planeindtijd;
    this.planEindTijdUnix = date.setHours(parseInt(planeindtijd.split(":")[0]), parseInt(planeindtijd.split(":")[1])).valueOf();
    this.eindVertraging = 0;
    if(splitInfo[4+4+startHasDelay] !==undefined) {
      this.eindVertraging = parseInt(splitInfo[4+4+startHasDelay].replace(/&nbsp;|\+/g, ""));
    }
    let delayedeindTime = new Date(date.setHours(parseInt(planeindtijd.split(":")[0]), parseInt(planeindtijd.split(":")[1])+this.eindVertraging));
    this.eindtijdUnix = delayedeindTime.valueOf();
    this.eindtijd = delayedeindTime.getHours() + ":" + delayedeindTime.getMinutes();
  }

  public addTrainData(html: string) {
    var element = load(html, null, false);
    console.log(element('[selected="selected"]').length);
    if(element('[selected="selected"]').length) {
      this.matnummer = element('[selected="selected"]').attr("value") as string;
      console.log(this.matnummer);
    }
    else {
      this.matnummer = element('.vts_matinfo>a').text() as string;
      console.log(this.matnummer);
    }
  }

  public toString(): ritArray {
    return ({
      tijd: this.tijd,
      afstand: this.afstand,
      matnummer: this.matnummer,
      ritnummer: this.ritnummer,
      ritserie: this.ritserie,
      starttijd: this.starttijd,
      eindtijd: this.eindtijd,
      planStarttijd: this.planStarttijd,
      planEindTijd: this.planEindTijd,
      starttijdUnix: this.starttijdUnix,
      eindtijdUnix: this.eindtijdUnix,
      planStarttijdUnix: this.planStarttijdUnix,
      planEindTijdUnix: this.planEindTijdUnix,
      startPunt: this.startPunt,
      startPuntSpoor: this.startPuntSpoor,
      eindPunt:this.eindPunt,
      eindPuntSpoor:this.eindPuntSpoor,
      startVertraging: this.startVertraging,
      eindVertraging: this.eindVertraging

    })
  }
  
}