/**
 * Seed script for riding skills.
 * Run with: bun src/db/seed-skills.ts
 *
 * Prerequisite IDs use placeholder keys that are resolved after insertion.
 * We insert all skills first (without prerequisites), then update with prerequisites.
 */
import '../lib/openapi' // must be first
import { db } from '.'
import { skills } from './schema'
import { eq } from 'drizzle-orm'

type Level = 'beginner' | 'intermediate' | 'advanced'

interface LevelData {
  level: Level
  description: string
  prerequisites: { skillKey: string; level: Level }[]
}

interface SeedSkill {
  key: string
  name: string
  category: string
  shortDescription: string
  longDescription: string
  levels: LevelData[]
}

const seedData: SeedSkill[] = [
  // ─── יציבה וישיבה ───────────────────────────────────────────────────────────
  {
    key: 'independent-seat',
    name: 'Independent Seat',
    category: 'יציבה וישיבה',
    shortDescription: 'היכולת לשבת על הסוס ביציבות ובאיזון ללא הישענות על הרסן.',
    longDescription:
      'ישיבה עצמאית היא הבסיס לכל רכיבה טובה — הרוכב מאזן את גופו דרך הליבה והמפרקים ולא דרך ידיו ורגליו. פיתוח מיומנות זו מאפשר לשלוח עזרים עדינים וברורים לסוס. ללא ישיבה עצמאית, כל שאר המיומנויות קשות לשליטה.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מסוגל לשבת בשקל ולשמור על מיקום בסיסי בהליכה, עם תמיכה מינימלית ברסן.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב שומר על ישיבה מאוזנת בהליכה ובדהרה קלה, מסוגל לשחרר ידיים ולשמור על יציב.',
        prerequisites: [
          { skillKey: 'independent-seat', level: 'beginner' },
          { skillKey: 'core-engagement', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'הרוכב שומר על ישיבה עצמאית מלאה בכל האמפלוכסים, כולל קפיצות וקצבים בלתי צפויים.',
        prerequisites: [
          { skillKey: 'independent-seat', level: 'intermediate' },
          { skillKey: 'core-engagement', level: 'intermediate' },
          { skillKey: 'upper-body-control', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'lower-leg-stability',
    name: 'Lower Leg Stability',
    category: 'יציבה וישיבה',
    shortDescription: 'שמירה על מיקום יציב ונכון של הרגל התחתונה בכל הקצבים.',
    longDescription:
      'יציבות הרגל התחתונה מספקת בסיס חזק לרוכב ומאפשרת שליטה עדינה בעזרי הרגל. רגל שמתנדנדת קדימה ואחורה מפריעה לאיזון ולמסרים שנשלחים לסוס. עבודה על חוזק הקרסול והאחיזה הנמוכה היא חיונית.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מחזיק את הרגל בקיבוע בסיסי תחת מרכז הגוף בהליכה.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description:
          'הרגל נשארת יציבה בדהרה קלה ומאפשרת שימוש בעזרי רגל מבלי לאבד את האיזון.',
        prerequisites: [
          { skillKey: 'lower-leg-stability', level: 'beginner' },
          { skillKey: 'independent-seat', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description: 'יציבות מלאה בכל הקצבים, כולל גישה לגדר וקפיצה, עם קרסול גמיש ופעיל.',
        prerequisites: [
          { skillKey: 'lower-leg-stability', level: 'intermediate' },
          { skillKey: 'independent-seat', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'upper-body-control',
    name: 'Upper Body Control',
    category: 'יציבה וישיבה',
    shortDescription: 'שמירה על גב ישר ושכמות פתוחות עם גמישות במפרקי הירכיים.',
    longDescription:
      'שליטה בפלג הגוף העליון מאפשרת לרוכב לספוג את תנועות הסוס מבלי להתמוטט קדימה או אחורה. גוף עליון יציב ומיושר משדר ביטחון ואנרגיה נכונה לסוס. יש לשמור על כתפיים רפויות, גב ישר וראש מורם.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב שומר על גב ישר בסיסי בהליכה ומודע למיקום הכתפיים.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב שומר על יישור עקבי בדהרה קלה ומסוגל להימנע מהישענות קדימה בפניות.',
        prerequisites: [
          { skillKey: 'upper-body-control', level: 'beginner' },
          { skillKey: 'core-engagement', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'שליטה מלאה בפלג הגוף העליון בכל האמפלוכסים, עם יכולת לפעול באופן עצמאי ביחס לפלג התחתון.',
        prerequisites: [
          { skillKey: 'upper-body-control', level: 'intermediate' },
          { skillKey: 'independent-seat', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'core-engagement',
    name: 'Core Engagement',
    category: 'יציבה וישיבה',
    shortDescription: 'הפעלה פעילה של שרירי הליבה לתמיכה ביציבה ולשיפור האיזון.',
    longDescription:
      'שרירי הליבה מחברים את פלגי הגוף ומאפשרים העברה יעילה של כוח ואיזון. הפעלתם הנכונה מפחיתה עומס על הגב ומגבירה את היציבות. תרגול מודע של הליבה ברכיבה משפר את כל שאר ההיבטים של המיומנות.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מודע לשרירי הליבה ויכול להפעילם בהליכה ביצירת מתח בסיסי.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description: 'הרוכב מפעיל את הליבה באופן עקבי בדהרה קלה ובמעברים.',
        prerequisites: [{ skillKey: 'core-engagement', level: 'beginner' }],
      },
      {
        level: 'advanced',
        description:
          'שימוש אוטומטי ומדויק בליבה לייצוב ולהנחיית הסוס, כולל בעבודה צידית ובקפיצות.',
        prerequisites: [
          { skillKey: 'core-engagement', level: 'intermediate' },
          { skillKey: 'independent-seat', level: 'intermediate' },
        ],
      },
    ],
  },

  // ─── שימוש בעזרים וטכניקות רכיבה ───────────────────────────────────────────
  {
    key: 'leg-aids',
    name: 'Leg Aids',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'שימוש נכון ומדויק ברגלי הרוכב להנעה, כיוון ועבודה צידית.',
    longDescription:
      'עזרי הרגל הם הכלי העיקרי של הרוכב לשלוח אנרגיה קדימה ולבקש תנועות שונות. הם מופעלים על ידי לחץ, מיקום ועיתוי. שליטה בעזרי רגל מאפשרת לרוכב לתקשר בצורה ברורה וחסכונית עם הסוס.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מבין את המושג של לחץ רגל בסיסי ומסוגל לבקש הנעה בהליכה.',
        prerequisites: [{ skillKey: 'lower-leg-stability', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב משתמש בעזרי רגל מול/מאחור לאוכף בדהרה קלה ומסוגל לכוון תנועה צידית בסיסית.',
        prerequisites: [
          { skillKey: 'leg-aids', level: 'beginner' },
          { skillKey: 'lower-leg-stability', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'שימוש מדויק בעזרי רגל לתנועות מורכבות: כניסה לחצי-פה, ספירל, ועבודה צידית מתקדמת.',
        prerequisites: [
          { skillKey: 'leg-aids', level: 'intermediate' },
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'rein-contact',
    name: 'Rein Contact',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'שמירה על קשר עדין, עקבי ואלסטי עם פה הסוס דרך הרסן.',
    longDescription:
      'קשר רסן נכון אינו מתח קשיח אלא תקשורת חיה ורגישה. הרוכב שומר על קו ישר מהמרפק דרך הידיים ועד לביט. קשר טוב מאפשר לסוס לחפש את הביט ולעבוד עם גב מורם וסגור.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מחזיק רסן ארוך עם מגע קל ועקבי, מבלי לתפוס ומבלי לרפות לגמרי.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב שומר על קשר אלסטי בדהרה קלה ומסוגל לתת ולקבל (אקורד) מבלי לאבד קשר.',
        prerequisites: [
          { skillKey: 'rein-contact', level: 'beginner' },
          { skillKey: 'independent-seat', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'קשר רסן דק ומדויק שמאפשר תקשורת דו-כיוונית עדינה; הרוכב מזהה שינויים קלים בפה הסוס.',
        prerequisites: [
          { skillKey: 'rein-contact', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'half-halt',
    name: 'Half-Halt',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'איסוף קצר ורגעי שמאזן את הסוס ומכין אותו לפעולה הבאה.',
    longDescription:
      'חצי-עצירה היא אחד הכלים הכי שימושיים ברכיבה — היא מאזנת את הסוס, משפרת את הכוננות שלו ומכינה אותו למעבר, פנייה או תנועה חדשה. היא מורכבת מסנכרון בין רסן, גוף ורגל. כשמבוצעת נכון, היא כמעט בלתי נראית.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מבין את הרעיון ומסוגל לבצע חצי-עצירה פשוטה בהליכה לפני פניות ועצירות.',
        prerequisites: [
          { skillKey: 'rein-contact', level: 'beginner' },
          { skillKey: 'leg-aids', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב מיישם חצי-עצירות בדהרה קלה ומשתמש בהן להכנת מעברים ולשיפור האיסוף.',
        prerequisites: [
          { skillKey: 'half-halt', level: 'beginner' },
          { skillKey: 'rein-contact', level: 'intermediate' },
          { skillKey: 'use-of-seat', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'חצי-עצירות עדינות ויעילות בדהרה גדולה ובגאלופ, המשמשות לאיסוף וכינון לפני קפיצות ותרגילי דרסאז׳.',
        prerequisites: [
          { skillKey: 'half-halt', level: 'intermediate' },
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'use-of-seat',
    name: 'Use of Seat',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'הפעלה מכוונת של הישיבה כעזר להנעה, האטה ועיצוב תנועת הסוס.',
    longDescription:
      'הישיבה היא העזר החזק ביותר שלרוכב, ואם היא מפותחת נכון — גוברת על ידיים ורגלים. על ידי הגברה או הפחתה של תנועת האגן, הרוכב יכול להנע, לאסוף ולכוון. זה דורש מודעות גוף גבוהה ותרגול ממושך.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מודע לתנועת האגן ומשתמש בישיבה להאטה בסיסית לפני עצירה.',
        prerequisites: [{ skillKey: 'independent-seat', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב משתמש בישיבה פעילה להנעה בדהרה קלה ולהבדלה בין ישיבה מנעת לישיבה עוצרת.',
        prerequisites: [
          { skillKey: 'use-of-seat', level: 'beginner' },
          { skillKey: 'independent-seat', level: 'intermediate' },
          { skillKey: 'core-engagement', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'שליטה מלאה בישיבה כעזר עיקרי — הרוכב מנהל את הגאלופ, מעברים ותרגילי איסוף בעיקר דרך הגוף.',
        prerequisites: [
          { skillKey: 'use-of-seat', level: 'intermediate' },
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'coordination-of-aids',
    name: 'Coordination of Aids',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'תיאום מדויק בין ידיים, רגלים וישיבה לשליחת מסרים קוהרנטיים לסוס.',
    longDescription:
      'כאשר העזרים לא מתואמים, הרוכב שולח מסרים סותרים לסוס ומבלבל אותו. תיאום העזרים מצריך מודעות גבוהה, תזמון נכון ותרגול רב. זוהי מיומנות שמבדילת בין רוכב ממוצע לרוכב מיומן.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מודע לצורך בתיאום ומסוגל לשלב ידיים ורגל בסיסי למעבר עצירה-הליכה.',
        prerequisites: [
          { skillKey: 'leg-aids', level: 'beginner' },
          { skillKey: 'rein-contact', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב מתאם עזרים בפניות ומעברים בדהרה קלה, עם מינימום עזרי תיקון אחרי הפעולה.',
        prerequisites: [
          { skillKey: 'coordination-of-aids', level: 'beginner' },
          { skillKey: 'use-of-seat', level: 'intermediate' },
          { skillKey: 'leg-aids', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'תיאום עזרים שקוף ומדויק המאפשר ביצוע תרגילים מורכבים כמו לטרל ומובמנטים בגאלופ.',
        prerequisites: [
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
          { skillKey: 'half-halt', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'transitions',
    name: 'Transitions',
    category: 'שימוש בעזרים וטכניקות רכיבה',
    shortDescription: 'ביצוע מעברים חלקים, מאוזנים ומיידיים בין ובתוך האמפלוכסים.',
    longDescription:
      'מעברים טובים מצביעים על רמת הכשרה גבוהה — הן של הסוס והן של הרוכב. מעבר חלק שומר על איזון, קצב ומגע רסן לאורך כל תהליך השינוי. מעברים תדירים ומדויקים הם כלי אימון בפני עצמם.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מבצע מעברים עצירה-הליכה-עצירה בעזרים ברורים ובזמן סביר.',
        prerequisites: [
          { skillKey: 'leg-aids', level: 'beginner' },
          { skillKey: 'rein-contact', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'מעברים הליכה-דהרה-הליכה חלקים עם שמירה על קצב ואיזון; כולל מעברים בתוך האמפלוכס.',
        prerequisites: [
          { skillKey: 'transitions', level: 'beginner' },
          { skillKey: 'half-halt', level: 'beginner' },
          { skillKey: 'coordination-of-aids', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'מעברים מיידיים ומדויקים בכל האמפלוכסים, כולל מעברים מגאלופ לעצירה ומעברים בסדרה.',
        prerequisites: [
          { skillKey: 'transitions', level: 'intermediate' },
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
          { skillKey: 'use-of-seat', level: 'intermediate' },
        ],
      },
    ],
  },

  // ─── עבודה מהקרקע ───────────────────────────────────────────────────────────
  {
    key: 'leading-control',
    name: 'Leading & Control from Ground',
    category: 'עבודה מהקרקע',
    shortDescription: 'הובלת הסוס ממקום למקום בבטחה ועם שמירה על גבולות ברורים.',
    longDescription:
      'עבודה מהקרקע מתחילה ביכולת להוביל סוס בצורה בטוחה וברורה. הובלה נכונה מלמדת את הסוס לכבד את שטח האדם ולהגיב לאיתותים עדינים. זוהי הבסיס לכל עבודה עם סוס, הן לרוכבים והן לאנשים שאינם רוכבים.',
    levels: [
      {
        level: 'beginner',
        description: 'המטפל מוביל את הסוס בביטחון בסיסי, שומר על מרחק בטוח ועוצר לפי בקשה.',
        prerequisites: [],
      },
      {
        level: 'intermediate',
        description:
          'הובלה מדויקת בין מכשולים, שמירה על מרחק גוף עקבי, ועצירה ופנייה מיידית לפי בקשה.',
        prerequisites: [{ skillKey: 'leading-control', level: 'beginner' }],
      },
      {
        level: 'advanced',
        description:
          'שליטה מלאה בתנועה, עצירה, גיבוי ופניות גם בסביבה מאתגרת עם סוסים שונים.',
        prerequisites: [
          { skillKey: 'leading-control', level: 'intermediate' },
          { skillKey: 'desensitization', level: 'beginner' },
        ],
      },
    ],
  },
  {
    key: 'lunging-basics',
    name: 'Lunging Basics',
    category: 'עבודה מהקרקע',
    shortDescription: 'עבודת לוּנגֶה בסיסית לפיתוח תנועה, גמישות ומגע מהקרקע.',
    longDescription:
      'לונגה היא כלי אימוני יעיל שמאפשר לאמן פיזית ופסיכולוגית את הסוס ללא משקל הרוכב. מאמן טוב ילמד לשלוט בגודל המעגל, הקצב והאנרגיה מהקרקע. עבודה זו גם מחזקת את הקשר בין הסוס לאדם.',
    levels: [
      {
        level: 'beginner',
        description: 'המאמן שולח את הסוס למעגל בסיסי בהליכה ובדהרה קלה עם כיוון ועצירה.',
        prerequisites: [{ skillKey: 'leading-control', level: 'intermediate' }],
      },
      {
        level: 'intermediate',
        description:
          'שמירה על מעגל עקבי, שינוי קצב בתוך האמפלוכס ומעברים חלקים בין קצבים.',
        prerequisites: [
          { skillKey: 'lunging-basics', level: 'beginner' },
          { skillKey: 'leading-control', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'לונגה עם ציוד, כולל שימוש ברסנות הולכה, עבודה על כיפוף ועל עיגול גב הסוס.',
        prerequisites: [
          { skillKey: 'lunging-basics', level: 'intermediate' },
          { skillKey: 'lateral-movements-ground', level: 'beginner' },
        ],
      },
    ],
  },
  {
    key: 'desensitization',
    name: 'Desensitization',
    category: 'עבודה מהקרקע',
    shortDescription: 'הכרת הסוס עם גירויים מאיימים על מנת להפחית תגובות חרדה ופחד.',
    longDescription:
      'תהליך הדה-סנסיטיזציה חיוני לבניית סוס בטוח לרכיבה ולעבודה. על ידי חשיפה הדרגתית ושיטתית לגירויים מאיימים, הסוס לומד שאין סכנה ורמת הלחץ שלו יורדת. זה מצריך סבלנות, תזמון ויכולת קריאה של שפת גוף הסוס.',
    levels: [
      {
        level: 'beginner',
        description:
          'המטפל מציג גירויים פשוטים (שקיות, מטפחות) מרחוק ומאפשר לסוס להתרגל בקצבו.',
        prerequisites: [{ skillKey: 'leading-control', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'עבודה עם גירויים חזקים יותר (רעשים, עצמים זרים), גם בתנועה, עם קריאה נכונה של שפת גוף.',
        prerequisites: [
          { skillKey: 'desensitization', level: 'beginner' },
          { skillKey: 'leading-control', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'שיטתיות בפרוטוקולי דה-סנסיטיזציה, כולל גירויים ספציפיים לתרפיה כמו כיסאות גלגלים, ילדים רועשים ותנועות פתאומיות.',
        prerequisites: [
          { skillKey: 'desensitization', level: 'intermediate' },
          { skillKey: 'lunging-basics', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'lateral-movements-ground',
    name: 'Lateral Movements from Ground',
    category: 'עבודה מהקרקע',
    shortDescription: 'הנחיית הסוס לתנועות צידיות מהקרקע לפיתוח גמישות ויעילות.',
    longDescription:
      'תנועות צידיות מהקרקע, כגון כתף פנימה (shoulder-in) ורגל לצלב (leg yield) בסיסי, מכינות את הסוס לתנועות מורכבות ברכיבה. הן גם מחזקות את שרירי הגב והירכיים ומשפרות את המעורבות של החלק האחורי. עבודה זו דורשת הבנה טובה של שפת גוף ומיקום.',
    levels: [
      {
        level: 'beginner',
        description:
          'המאמן מבקש מהסוס לסגת הצידה עם לחץ קל על הכתף או הצדדים מהקרקע.',
        prerequisites: [{ skillKey: 'leading-control', level: 'intermediate' }],
      },
      {
        level: 'intermediate',
        description:
          'הנחיית הסוס לגירוס (turn on haunches) ולגירוס קדמי (turn on forehand) מהקרקע עם עקביות.',
        prerequisites: [
          { skillKey: 'lateral-movements-ground', level: 'beginner' },
          { skillKey: 'leading-control', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'עבודה בסדרות תנועה צידית, כולל פסיאדה (passade) בסיסי ועבודה בשתי מסילות מהקרקע.',
        prerequisites: [
          { skillKey: 'lateral-movements-ground', level: 'intermediate' },
          { skillKey: 'lunging-basics', level: 'intermediate' },
        ],
      },
    ],
  },

  // ─── קפיצות ─────────────────────────────────────────────────────────────────
  {
    key: 'jump-position',
    name: 'Jump Position',
    category: 'קפיצות',
    shortDescription: 'שמירה על עמדת קפיצה נכונה עם כפיפה קדימה וסנכרון עם הסוס.',
    longDescription:
      'עמדת הקפיצה (two-point / jumping position) דורשת כיפוף ירכיים, ברכיים וקרסולים כגזרנים, עם מרכז הכובד מעל כפות הרגלים. הידיים מתקדמות עם הסוס לאפשר חופש לצוואר. זוהי הבסיס הפיזי לכל קפיצה בטוחה ויעילה.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מחזיק two-point בסיסי בהליכה ובדהרה קלה מעל גדר נמוכה (20–30 ס"מ).',
        prerequisites: [
          { skillKey: 'lower-leg-stability', level: 'intermediate' },
          { skillKey: 'independent-seat', level: 'intermediate' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'שמירה על עמדת קפיצה עקבית מעל גדרות בגובה 60–80 ס"מ עם סנכרון מלא עם הסוס.',
        prerequisites: [
          { skillKey: 'jump-position', level: 'beginner' },
          { skillKey: 'lower-leg-stability', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'עמדת קפיצה גמישה ומסתגלת מעל גדרות 100 ס"מ ומעלה, כולל התאמה לגדרות שונות.',
        prerequisites: [
          { skillKey: 'jump-position', level: 'intermediate' },
          { skillKey: 'lower-leg-stability', level: 'advanced' },
        ],
      },
    ],
  },
  {
    key: 'approach-to-fence',
    name: 'Approach to Fence',
    category: 'קפיצות',
    shortDescription: 'גישה נכונה לגדר עם קצב עקבי, קו ישר ומרחק נכון.',
    longDescription:
      'הגישה לגדר קובעת 80% מהצלחת הקפיצה. גישה טובה שומרת על קצב מאוזן, קו ישר ומרחק נכון לנקודת ההמראה. הרוכב אחראי לשמור על האנרגיה ועל הכיוון, בעוד הסוס מחשב את המרחק.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב שולט בגישה ישרה לגדר נמוכה בדהרה קלה, שומר על קצב עקבי בשלושת הצעדים האחרונים.',
        prerequisites: [
          { skillKey: 'jump-position', level: 'beginner' },
          { skillKey: 'transitions', level: 'intermediate' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'שמירה על קצב ואיזון בגישה לגדרות שונות, כולל גישה מפניות ושמירה על הקו הנכון.',
        prerequisites: [
          { skillKey: 'approach-to-fence', level: 'beginner' },
          { skillKey: 'rhythm-control', level: 'beginner' },
          { skillKey: 'half-halt', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'גישה מכוילת לסוגי גדרות שונים (אוקספורד, קומבינציה, ווטר), עם יכולת לקצר ולהאריך צעדים לפי הצורך.',
        prerequisites: [
          { skillKey: 'approach-to-fence', level: 'intermediate' },
          { skillKey: 'adjusting-stride', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'grid-work',
    name: 'Grid Work',
    category: 'קפיצות',
    shortDescription: 'עבודה בסדרות גדרות (גרידים) לשיפור קצב, כוח ואוטומטיות.',
    longDescription:
      'גרידים (שורות גדרות) מלמדים את הסוס והרוכב לעבוד בקצב קבוע ולמצוא נקודת המראה נכונה. הגריד "מתקן" שגיאות ומלמד שניהם להסתגל. עבודה קבועה בגרידים משפרת את הכוח, הקיל ורמת הסמכות של שניהם.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב עובר דרך גריד פשוט (קרוסרל + אוקספורד נמוך) ושומר על עמדת קפיצה ורסן פנוי.',
        prerequisites: [
          { skillKey: 'jump-position', level: 'beginner' },
          { skillKey: 'approach-to-fence', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'עבודה בגרידים מורכבים עם מספרי צעדים שונים, כולל קומבינציות ואוקספורדים.',
        prerequisites: [
          { skillKey: 'grid-work', level: 'beginner' },
          { skillKey: 'approach-to-fence', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'גרידים מתקדמים עם שינויי גובה ומרווחים, מותאמים לעבודה ספציפית על חולשות הסוס.',
        prerequisites: [
          { skillKey: 'grid-work', level: 'intermediate' },
          { skillKey: 'adjusting-stride', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'course-riding',
    name: 'Course Riding',
    category: 'קפיצות',
    shortDescription: 'רכיבת מסלול קפיצות מלא עם תכנון, שמירה על קצב ותיאום גדרות.',
    longDescription:
      'רכיבת מסלול דורשת שמיעת מחשבות רבות בו-זמנית: ניווט, קצב, מרחקים, כניסה לגדר ויציאה ממנה. הרוכב צריך לתכנן קדימה תוך כדי תגובה לסוס. זהו השלב שמחבר את כל מיומנויות הקפיצה לכדי שלם.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב עובר מסלול פשוט של 4–6 גדרות נמוכות (50–70 ס"מ) עם תכנון מוקדם.',
        prerequisites: [
          { skillKey: 'approach-to-fence', level: 'intermediate' },
          { skillKey: 'grid-work', level: 'beginner' },
          { skillKey: 'transitions', level: 'intermediate' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'רכיבת מסלול של 8–10 גדרות ב-80–90 ס"מ, עם שמירה על קצב אחיד ויציאות נכונות.',
        prerequisites: [
          { skillKey: 'course-riding', level: 'beginner' },
          { skillKey: 'adjusting-stride', level: 'beginner' },
          { skillKey: 'approach-to-fence', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'רכיבת מסלולים בגובה 110–120 ס"מ עם זמן, כולל כניסות קשות וגדרות מורכבות.',
        prerequisites: [
          { skillKey: 'course-riding', level: 'intermediate' },
          { skillKey: 'adjusting-stride', level: 'advanced' },
          { skillKey: 'approach-to-fence', level: 'advanced' },
        ],
      },
    ],
  },
  {
    key: 'adjusting-stride',
    name: 'Adjusting Stride',
    category: 'קפיצות',
    shortDescription: 'יכולת לקצר ולהאריך את צעדי הגאלופ לפי הצורך בין גדרות.',
    longDescription:
      'כוונון הצעד הוא מיומנות מתקדמת שמאפשרת לרוכב לתקן מרחקים קצרים מדי או ארוכים מדי בין גדרות. הרוכב צריך לזהות מוקדם מספיק, לקבל החלטה ולבצע שינוי עדין מבלי לשבש את הקצב. זה דורש תחושה מפותחת ושמיעה דו-כיוונית עם הסוס.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מבין את הרעיון ומסוגל לקצר/להאריך צעד אחד-שניים בין שתי גדרות פשוטות.',
        prerequisites: [
          { skillKey: 'approach-to-fence', level: 'intermediate' },
          { skillKey: 'transitions', level: 'intermediate' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב מתאים את הצעדים בכל קומבינציה כדי לקבל נקודת המראה נוחה, עם שמירה על קצב.',
        prerequisites: [
          { skillKey: 'adjusting-stride', level: 'beginner' },
          { skillKey: 'half-halt', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'כוונון מדויק ועדין, לרבות בחירת מסלול קצר/ארוך לגדר ועבודה במרחקים לא סטנדרטיים.',
        prerequisites: [
          { skillKey: 'adjusting-stride', level: 'intermediate' },
          { skillKey: 'rhythm-control', level: 'advanced' },
        ],
      },
    ],
  },

  // ─── רגש, תיקון בעיות ────────────────────────────────────────────────────────
  {
    key: 'feel-and-timing',
    name: 'Feel & Timing',
    category: 'רגש, תיקון בעיות',
    shortDescription: 'פיתוח תחושה עדינה לתנועת הסוס ויכולת לשלוח עזר בזמן הנכון.',
    longDescription:
      'תזמון נכון הוא ההבדל בין עזר יעיל לעזר מבלבל. הרוכב צריך להרגיש מתי הרגל של הסוס בשלב הנכון ולפעול בהתאם. מיומנות זו מפותחת עם ניסיון ועם מודעות גוף גבוהה, ואינה ניתנת לדילוג.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מתחיל לזהות את קצב ההליכה של הסוס ומנסה לסנכרן את הגוף.',
        prerequisites: [{ skillKey: 'independent-seat', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'הרוכב מרגיש את מחזורי הדהרה הקלה והגאלופ ומסוגל לשלוח עזרים בתזמון עקבי.',
        prerequisites: [
          { skillKey: 'feel-and-timing', level: 'beginner' },
          { skillKey: 'independent-seat', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'תחושה עדינה ומדויקת המאפשרת תגובה לשינויים קטנים בגב ובצעד הסוס; בסיס לעבודת דרסאז׳ גבוהה.',
        prerequisites: [
          { skillKey: 'feel-and-timing', level: 'intermediate' },
          { skillKey: 'use-of-seat', level: 'intermediate' },
          { skillKey: 'rein-contact', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'rhythm-control',
    name: 'Rhythm Control',
    category: 'רגש, תיקון בעיות',
    shortDescription: 'שמירה על קצב עקבי ומאוזן בכל האמפלוכסים ובשינויי כיוון.',
    longDescription:
      'קצב עקבי הוא הבסיס לכל עבודה איכותית. סוס שמשנה קצב ללא בקשה לא מקשיב מספיק, וסוס שנשאר קצבי מקל על כל שאר העבודה. הרוכב אחראי לשמור על הקצב דרך עזרים עדינים ומנטרה קבועה.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב שומר על קצב הליכה עקבי ומזהה מתי הסוס מאיץ או מאט ללא בקשה.',
        prerequisites: [{ skillKey: 'leg-aids', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'שמירה על קצב עקבי בדהרה קלה, גם בפניות ובשינויי כיוון, עם תיקונים מינימליים.',
        prerequisites: [
          { skillKey: 'rhythm-control', level: 'beginner' },
          { skillKey: 'transitions', level: 'intermediate' },
          { skillKey: 'half-halt', level: 'beginner' },
        ],
      },
      {
        level: 'advanced',
        description:
          'שמירה על קצב בגאלופ ובמסלולי קפיצה; יכולת לשנות קצב ביודעין ולחזור לקצב הבסיסי.',
        prerequisites: [
          { skillKey: 'rhythm-control', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
          { skillKey: 'half-halt', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'correcting-rushing',
    name: 'Correcting Rushing',
    category: 'רגש, תיקון בעיות',
    shortDescription: 'טכניקות לטיפול בסוס שממהר, מאיץ ומאבד שקט בעבודה.',
    longDescription:
      'סוס שממהר הוא סוס לחוץ, שמנסה להימנע מעבודה או חווה חרדה. הפתרון אינו עצירה בכוח אלא יצירת רגיעה דרך עבודה מחושבת, פניות, מעברים ושינויי גודל מעגל. הרוכב צריך להישאר רגוע ולשלוח עזרים עדינים ועקביים.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מזהה סימני הממהר ומשתמש בפניות ובעיגולים להאטת הסוס בלי כוח.',
        prerequisites: [
          { skillKey: 'rhythm-control', level: 'beginner' },
          { skillKey: 'transitions', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'שימוש בחצי-עצירות, שינויי גודל מעגל ועבודה על קצב כדי לטפל בהממהר בדהרה קלה.',
        prerequisites: [
          { skillKey: 'correcting-rushing', level: 'beginner' },
          { skillKey: 'half-halt', level: 'intermediate' },
          { skillKey: 'rhythm-control', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'פרוטוקול שיטתי לתיקון ממהר מבוסס, כולל שינויי מסלול, עבודה על רגיעה ושינוי מיינדסט הסוס.',
        prerequisites: [
          { skillKey: 'correcting-rushing', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
          { skillKey: 'coordination-of-aids', level: 'advanced' },
        ],
      },
    ],
  },
  {
    key: 'correcting-laziness',
    name: 'Correcting Laziness',
    category: 'רגש, תיקון בעיות',
    shortDescription: 'טכניקות לעבוד עם סוס עצלן ולפתח תגובתיות לעזרים.',
    longDescription:
      'סוס עצלן מחייב את הרוכב להשתמש בעזרים חזקים יותר, מה שמוביל לאימום הדדי. הפתרון הוא לדרוש תגובה מיידית לעזר קל ולחזק אותה, מבלי להגדיל את עוצמת העזר. עבודה על אנרגיה קדימה ועל תגובתיות משנה את הסוס בצורה מהותית.',
    levels: [
      {
        level: 'beginner',
        description:
          'הרוכב מבין את עקרון "עזר קל, תגובה מיידית" ומיישם חיזוק חיובי קצר בהליכה.',
        prerequisites: [{ skillKey: 'leg-aids', level: 'beginner' }],
      },
      {
        level: 'intermediate',
        description:
          'שימוש בעזרים מתדרגים ובחיזוק כדי לשפר תגובתיות בדהרה קלה, כולל עזרי שוט כגיבוי.',
        prerequisites: [
          { skillKey: 'correcting-laziness', level: 'beginner' },
          { skillKey: 'leg-aids', level: 'intermediate' },
          { skillKey: 'transitions', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'עבודה שיטתית לבניית "אש קדימה" בסוסים עצלניים, כולל שינויי קצב, עבודת שטח ואתגרים חדשים.',
        prerequisites: [
          { skillKey: 'correcting-laziness', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'intermediate' },
        ],
      },
    ],
  },
  {
    key: 'straightness-issues',
    name: 'Straightness Issues',
    category: 'רגש, תיקון בעיות',
    shortDescription: 'זיהוי ותיקון בעיות יישור גוף הסוס לאורך קווים ועיגולים.',
    longDescription:
      'רוב הסוסים נולדים עם עקמומיות טבעית לאחד מהצדדים. יישור נכון חיוני הן לאיכות העבודה והן לבריאות ארוכת הטווח של הסוס. הרוכב לומד לזהות כיפוף, ישיר ולהשתמש בעזרים לתיקון.',
    levels: [
      {
        level: 'beginner',
        description: 'הרוכב מזהה שהסוס "בורח" לאחד הצדדים ומנסה לתקן עם רסן קצר לאותו צד.',
        prerequisites: [
          { skillKey: 'rein-contact', level: 'beginner' },
          { skillKey: 'leg-aids', level: 'beginner' },
        ],
      },
      {
        level: 'intermediate',
        description:
          'שימוש בעזרי קיבוף וכתף-פנימה בסיסי לשיפור יישור על קווים ישרים ועיגולים.',
        prerequisites: [
          { skillKey: 'straightness-issues', level: 'beginner' },
          { skillKey: 'coordination-of-aids', level: 'intermediate' },
          { skillKey: 'leg-aids', level: 'intermediate' },
        ],
      },
      {
        level: 'advanced',
        description:
          'תכנית עבודה שיטתית ליישור, כולל תרגילי כיפוף לשני הצדדים, עבודה על קיר ועבודת ספירל.',
        prerequisites: [
          { skillKey: 'straightness-issues', level: 'intermediate' },
          { skillKey: 'lateral-movements-ground', level: 'intermediate' },
          { skillKey: 'feel-and-timing', level: 'advanced' },
        ],
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Seeding riding skills...')

  // Step 1: Insert all skills without prerequisites (use empty arrays)
  const keyToId = new Map<string, string>()

  for (const skill of seedData) {
    const levelsWithoutPrereqs = skill.levels.map((l) => ({
      level: l.level,
      description: l.description,
      prerequisites: [] as { skillId: string; level: string }[],
    }))

    const [inserted] = await db
      .insert(skills)
      .values({
        name: skill.name,
        category: skill.category,
        shortDescription: skill.shortDescription,
        longDescription: skill.longDescription,
        levels: levelsWithoutPrereqs,
      })
      .returning()

    keyToId.set(skill.key, inserted.id)
    console.log(`  ✓ ${skill.name} → ${inserted.id}`)
  }

  // Step 2: Update each skill with resolved prerequisite IDs
  for (const skill of seedData) {
    const skillId = keyToId.get(skill.key)!
    const resolvedLevels = skill.levels.map((l) => ({
      level: l.level,
      description: l.description,
      prerequisites: l.prerequisites
        .map((p) => {
          const resolvedId = keyToId.get(p.skillKey)
          if (!resolvedId) {
            console.warn(`  ⚠️  Unknown prerequisite key: ${p.skillKey}`)
            return null
          }
          return { skillId: resolvedId, level: p.level }
        })
        .filter(Boolean) as { skillId: string; level: string }[],
    }))

    await db.update(skills).set({ levels: resolvedLevels }).where(eq(skills.id, skillId))
  }

  console.log(`\n✅ Seeded ${seedData.length} skills successfully.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
