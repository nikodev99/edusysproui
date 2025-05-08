import Datetime, {isParams} from "./datetime.ts";
import dayjs from "dayjs";

const time = {date: new Date(), locale: 'en'}

const isObject = isParams(time)
console.log(isObject)

const date = Datetime.of(dayjs())

console.log(date)