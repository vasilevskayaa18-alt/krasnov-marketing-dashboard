const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const seedTasks = [
  {id:1,section:"Instagram",title:"Проводить философию KRASNOV красной нитью через весь контент; выделить дополнительные тезисы и раскрывать их в публикациях.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянная задача — лучше контролировать еженедельно."},
  {id:2,section:"Instagram",title:"Создать актуальное с процессом реализации проекта от начала до конца: задача/боль клиента → решения → ход работ → результат.",owners:["Надежда","Команда Маркетинга"],status:"В работе",deadline:"2026-10-20",priority:"Высокий",note:"Дедлайн из сообщения Надежды от 23.09."},
  {id:3,section:"Instagram",title:"Сделать отдельное актуальное о философии KRASNOV на 2–3 слайда.",owners:["Команда Маркетинга"],status:"Не начато",deadline:null,priority:"Обычный",note:"Дедлайн не указан."},
  {id:4,section:"Instagram",title:"Собрать тестовый Reels из подсъёмов реального ремонта, чтобы показывать процесс реализации.",owners:["Ютуберы","Команда Маркетинга"],status:"В работе",deadline:"2026-10-04",priority:"Высокий",note:"Тестовый ролик."},
  {id:5,section:"Instagram",title:"Публиковать посты с дизайн-проектами студии, чтобы показывать товар лицом.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Обычный",note:"Регулярная задача — лучше вынести в контент-план."},
  {id:6,section:"CTA и точки касания",title:"Заменить CTA на одностраничниках: презентации проектов, «30 минут с дизайнером KRASNOV», гайд «10 ошибок в ремонте», бриф «50 вопросов перед ремонтом».",owners:["Надежда","Команда Маркетинга"],status:"Не начато",deadline:"2026-09-27",priority:"Критичный",note:"Проверить выполнение."},
  {id:7,section:"CTA и точки касания",title:"Использовать согласованные заходы и дисклеймеры во всём контенте и точках касания.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянный стандарт."},
  {id:8,section:"CTA и точки касания",title:"Соблюдать схему CTA: конкретный заход → если планируете работу с нами → приглашение обсудить объект → дисклеймер.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянный стандарт."},
  {id:9,section:"CTA и точки касания",title:"Объяснять содержание первой встречи: объект, задачи, сроки, бюджет, формат работы; при необходимости планировка, референсы, бриф.",owners:["Команда Маркетинга","Настя"],status:"Не начато",deadline:null,priority:"Высокий",note:"Нужно закрепить единый текст."},
  {id:10,section:"CTA и точки касания",title:"Обозначать границы первой встречи: без разбора отдельных комнат, точечных вопросов по готовому интерьеру, подбора мебели и отдельных решений.",owners:["Команда Маркетинга","Настя"],status:"Не начато",deadline:null,priority:"Высокий",note:"Нужно закрепить единый дисклеймер."},
  {id:11,section:"CTA и точки касания",title:"Убрать призыв «Бесплатная консультация» из описаний к видео, постов и лендингов; не вести на отдельную страницу бесплатной консультации.",owners:["Надежда","Команда Маркетинга"],status:"В работе",deadline:"2026-10-20",priority:"Критичный",note:"Дедлайн 20.10."},
  {id:12,section:"Лид-магниты",title:"Собрать и отобрать реальные рабочие документы студии, полезные потенциальным заказчикам.",owners:["Настя","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Сначала студия предоставляет документы."},
  {id:13,section:"Лид-магниты",title:"Подготовить отдельный лендинг под каждый выбранный рабочий документ.",owners:["Надежда","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Срок — в течение недели после предоставления материалов."},
  {id:14,section:"Мини-продукт",title:"Внедрить мини-продукт «Планировочные решения (трипваер)».",owners:["Надежда","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Ожидается полное описание и тексты для анонса."},
  {id:15,section:"Персонализированные сторис",title:"Показать примеры персонализированных сторис, которые делали в ВВ.",owners:["Надежда"],status:"Не начато",deadline:null,priority:"Обычный",note:"Дедлайн не указан."},
  {id:16,section:"Персонализированные сторис",title:"Адаптировать формат для KRASNOV: запрос клиента + образ жизни + состав семьи → решения проекта → переход к подробностям.",owners:["Надежда","Команда Маркетинга"],status:"Не начато",deadline:null,priority:"Высокий",note:"После примеров из ВВ."}
];

async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not configured yet.");
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS marketing_tasks (
      id BIGINT PRIMARY KEY,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      owners JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'Не начато',
      deadline DATE,
      priority TEXT NOT NULL DEFAULT 'Обычный',
      note TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  const count = Number((await pool.query("SELECT COUNT(*) AS n FROM marketing_tasks")).rows[0].n);
  if (count === 0) {
    for (const t of seedTasks) {
      await pool.query(
        "INSERT INTO marketing_tasks (id,section,title,owners,status,deadline,priority,note) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8)",
        [t.id,t.section,t.title,JSON.stringify(t.owners),t.status,t.deadline,t.priority,t.note]
      );
    }
  }
}

app.get("/health", async (_req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({ok:false,database:false,reason:"DATABASE_URL missing"});
  try {
    await pool.query("SELECT 1");
    res.json({ok:true,database:true});
  } catch (e) {
    res.status(503).json({ok:false,database:false});
  }
});

app.get("/api/tasks", async (_req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  try {
    const { rows } = await pool.query("SELECT id,section,title,owners,status,deadline,priority,note,updated_at FROM marketing_tasks ORDER BY id");
    res.json(rows.map(r => ({...r, deadline:r.deadline ? r.deadline.toISOString().slice(0,10) : ""})));
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.post("/api/tasks", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  const t = req.body || {};
  const id = Date.now();
  try {
    const { rows } = await pool.query(
      "INSERT INTO marketing_tasks (id,section,title,owners,status,deadline,priority,note) VALUES ($1,$2,$3,$4::jsonb,$5,NULLIF($6,'')::date,$7,$8) RETURNING *",
      [id,t.section||"",t.title||"",JSON.stringify(Array.isArray(t.owners)?t.owners:[]),t.status||"Не начато",t.deadline||"",t.priority||"Обычный",t.note||""]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.put("/api/tasks/:id", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  const t = req.body || {};
  try {
    const { rows } = await pool.query(
      "UPDATE marketing_tasks SET section=$2,title=$3,owners=$4::jsonb,status=$5,deadline=NULLIF($6,'')::date,priority=$7,note=$8,updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id,t.section||"",t.title||"",JSON.stringify(Array.isArray(t.owners)?t.owners:[]),t.status||"Не начато",t.deadline||"",t.priority||"Обычный",t.note||""]
    );
    if (!rows.length) return res.status(404).json({error:"not_found"});
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.delete("/api/tasks/:id", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  try {
    await pool.query("DELETE FROM marketing_tasks WHERE id=$1",[req.params.id]);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.get("*", (_req,res) => res.sendFile(path.join(__dirname,"public","index.html")));

initDb().catch(err => console.error("DB init failed:",err.message));
app.listen(PORT, () => console.log("KRASNOV team dashboard on port", PORT));
