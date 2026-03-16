/**
 * Seed script — inserts the initial 6 horses with their tags.
 * Safe to run multiple times: creates missing horses and fills in any missing tag categories.
 *
 * Run with: bun run db:seed
 */
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq, and } from 'drizzle-orm'
import { Pool } from 'pg'
import { horses, horseTags } from './schema/horses'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL environment variable is required')

const pool = new Pool({ connectionString: databaseUrl })
const db = drizzle({ client: pool })

type TagCategory =
  | 'age'
  | 'temperament'
  | 'level'
  | 'purpose'
  | 'gender'
  | 'size'
  | 'color'
  | 'seniority'

const seedData = [
  {
    name: 'ענן',
    age: 8,
    description: 'סוס חום עדין, אוהב ילדים ומתאים לרכיבה טיפולית',
    fullDescription:
      'ענן הוא סוס חום עדין ומסור, עם לב טוב במיוחד לילדים. הוא משתתף בתוכנית הרכיבה הטיפולית שלנו כבר שש שנים ומרגיש את צרכיהם של הרוכבים באופן יוצא דופן. בחירה מושלמת עבור מי שמתחיל את מסע הטיפול הרגשי.',
    breed: 'חצי דם',
    color: 'חום',
    imageEmoji: '🐴',
    tags: [
      { category: 'age' as TagCategory, label: 'בוגר' },
      { category: 'temperament' as TagCategory, label: 'רגוע' },
      { category: 'level' as TagCategory, label: 'מתאים למתחילים' },
      { category: 'purpose' as TagCategory, label: 'טיפולי' },
      { category: 'gender' as TagCategory, label: 'סוס' },
      { category: 'size' as TagCategory, label: 'בינוני' },
      { category: 'color' as TagCategory, label: 'חום' },
      { category: 'seniority' as TagCategory, label: 'מנוסה' },
    ],
  },
  {
    name: 'ברק',
    age: 5,
    description: 'סוס שחור אנרגטי, מצוין לאימוני רכיבה מתקדמים',
    fullDescription:
      'ברק הוא סוס שחור יפהפה עם אנרגיה רבה ורצון עז להצליח. הוא מצטיין בתרגילי קפיצות ודרסאז׳ ברמה גבוהה. מתאים לרוכבים מנוסים שמחפשים אתגר אמיתי ושותף נאמן לאימונים.',
    breed: 'ולבלוד',
    color: 'שחור',
    imageEmoji: '🐎',
    tags: [
      { category: 'age' as TagCategory, label: 'צעיר' },
      { category: 'temperament' as TagCategory, label: 'אנרגטי' },
      { category: 'level' as TagCategory, label: 'מתקדם' },
      { category: 'purpose' as TagCategory, label: 'תחרותי' },
      { category: 'gender' as TagCategory, label: 'סוס' },
      { category: 'size' as TagCategory, label: 'גדול' },
      { category: 'color' as TagCategory, label: 'שחור' },
      { category: 'seniority' as TagCategory, label: 'מתחיל' },
    ],
  },
  {
    name: 'כוכב',
    age: 12,
    description: 'סייחה לבנה רגועה, מושלמת למתחילים',
    fullDescription:
      'כוכב היא סייחה לבנה מרהיבה עם אופי רגוע ומאוזן. בשנות הניסיון הרבות שלה, היא ליוותה מאות רוכבים בצעדיהם הראשונים. סבלנותה האינסופית הופכת אותה לבחירה הטובה ביותר למתחילים ולילדים.',
    breed: 'ערבי',
    color: 'לבן',
    imageEmoji: '🐴',
    tags: [
      { category: 'age' as TagCategory, label: 'זקן' },
      { category: 'temperament' as TagCategory, label: 'רגוע' },
      { category: 'level' as TagCategory, label: 'מתאים למתחילים' },
      { category: 'purpose' as TagCategory, label: 'פנאי' },
      { category: 'gender' as TagCategory, label: 'סוסה' },
      { category: 'size' as TagCategory, label: 'קטן' },
      { category: 'color' as TagCategory, label: 'לבן' },
      { category: 'seniority' as TagCategory, label: 'ותיק' },
    ],
  },
  {
    name: 'סופה',
    age: 7,
    description: 'סוסה חומה, בעלת אופי חזק ונוכחות מרשימה',
    fullDescription:
      'סופה היא סוסה חומה יוצאת דופן עם נוכחות מלכותית. אופייה החזק והבטוח בעצמה מושך רוכבים שמחפשים סוסה עם אישיות. היא מצטיינת בתרגילי שדה ורכיבה בטבע הפתוח.',
    breed: 'קוורטר הורס',
    color: 'חום כהה',
    imageEmoji: '🐎',
    tags: [
      { category: 'age' as TagCategory, label: 'בוגר' },
      { category: 'temperament' as TagCategory, label: 'סוער' },
      { category: 'level' as TagCategory, label: 'מתקדם' },
      { category: 'purpose' as TagCategory, label: 'תחרותי' },
      { category: 'gender' as TagCategory, label: 'סוסה' },
      { category: 'size' as TagCategory, label: 'גדול' },
      { category: 'color' as TagCategory, label: 'חום' },
      { category: 'seniority' as TagCategory, label: 'מנוסה' },
    ],
  },
  {
    name: 'גל',
    age: 10,
    description: 'סוס אפור ותיק, מלווה ילדים בטיפול רגשי',
    fullDescription:
      'גל הוא סוס אפור בעל חוכמת שנים. הניסיון העשיר שלו בטיפול רגשי הופך אותו לשותף יקר ערך לפסיכולוגים ומטפלים. הוא מרגיש את מצב הרוח של האדם לידו ומגיב בהתאם בעדינות ובאמפתיה.',
    breed: 'חצי דם',
    color: 'אפור',
    imageEmoji: '🐴',
    tags: [
      { category: 'age' as TagCategory, label: 'בוגר' },
      { category: 'temperament' as TagCategory, label: 'רגוע' },
      { category: 'level' as TagCategory, label: 'מתאים למתחילים' },
      { category: 'purpose' as TagCategory, label: 'טיפולי' },
      { category: 'gender' as TagCategory, label: 'סוס' },
      { category: 'size' as TagCategory, label: 'בינוני' },
      { category: 'color' as TagCategory, label: 'אפור' },
      { category: 'seniority' as TagCategory, label: 'ותיק' },
    ],
  },
  {
    name: 'אש',
    age: 6,
    description: 'סוס אדמדם שובב, מחובר לאנשים',
    fullDescription:
      'אש הוא סוס חום-אדמדם עם ניצוץ בעיניים. האישיות השובבה שלו ואהבתו לבני אדם הופכים כל מפגש לחוויה בלתי נשכחת. הוא מתאים לפעילויות פנאי ורכיבה ספורטיבית ברמה בינונית.',
    breed: 'מוסטנג',
    color: 'ערמוני',
    imageEmoji: '🐎',
    tags: [
      { category: 'age' as TagCategory, label: 'צעיר' },
      { category: 'temperament' as TagCategory, label: 'אנרגטי' },
      { category: 'level' as TagCategory, label: 'מתקדם' },
      { category: 'purpose' as TagCategory, label: 'פנאי' },
      { category: 'gender' as TagCategory, label: 'סוס' },
      { category: 'size' as TagCategory, label: 'בינוני' },
      { category: 'color' as TagCategory, label: 'ערמוני' },
      { category: 'seniority' as TagCategory, label: 'מתחיל' },
    ],
  },
]

for (const data of seedData) {
  const { tags, ...horseData } = data

  // Upsert horse by name
  let [existing] = await db
    .select({ id: horses.id })
    .from(horses)
    .where(eq(horses.name, horseData.name))
    .limit(1)
  if (!existing) {
    ;[existing] = await db.insert(horses).values(horseData).returning({ id: horses.id })
    console.log(`Inserted horse: ${horseData.name}`)
  }

  const horseId = existing.id

  // Insert only missing tag categories
  for (const tag of tags) {
    const [existingTag] = await db
      .select({ id: horseTags.id })
      .from(horseTags)
      .where(and(eq(horseTags.horseId, horseId), eq(horseTags.category, tag.category)))
      .limit(1)

    if (!existingTag) {
      await db.insert(horseTags).values({ ...tag, horseId })
      console.log(`  Added tag [${tag.category}] to ${horseData.name}`)
    }
  }
}

console.log('Seed completed.')
await pool.end()
