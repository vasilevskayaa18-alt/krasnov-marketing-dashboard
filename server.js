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
  {id:1,section:"Instagram",title:"Проводить философию KRASNOV красной нитью через весь контент; выделить дополнительные тезисы и раскрывать их в публикациях.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянная задача — лучше контролировать еженедельно.",is_recurring:true},
  {id:2,section:"Instagram",title:"Создать актуальное с процессом реализации проекта от начала до конца: задача/боль клиента → решения → ход работ → результат.",owners:["Надежда","Команда Маркетинга"],status:"В работе",deadline:"2026-10-20",priority:"Высокий",note:"Дедлайн из сообщения Надежды от 23.09.",is_recurring:false},
  {id:3,section:"Instagram",title:"Сделать отдельное актуальное о философии KRASNOV на 2–3 слайда.",owners:["Команда Маркетинга"],status:"Запланировано",deadline:null,priority:"Обычный",note:"Дедлайн не указан.",is_recurring:false},
  {id:4,section:"Instagram",title:"Собрать тестовый Reels из подсъёмов реального ремонта, чтобы показывать процесс реализации.",owners:["Ютуберы","Команда Маркетинга"],status:"В работе",deadline:"2026-10-04",priority:"Высокий",note:"Тестовый ролик.",is_recurring:false},
  {id:5,section:"Instagram",title:"Публиковать посты с дизайн-проектами студии, чтобы показывать товар лицом.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Обычный",note:"Регулярная задача — лучше вынести в контент-план.",is_recurring:true},
  {id:6,section:"CTA и точки касания",title:"Заменить CTA на одностраничниках: презентации проектов, «30 минут с дизайнером KRASNOV», гайд «10 ошибок в ремонте», бриф «50 вопросов перед ремонтом».",owners:["Надежда","Команда Маркетинга"],status:"Запланировано",deadline:"2026-09-27",priority:"Критичный",note:"Проверить выполнение.",is_recurring:false},
  {id:7,section:"CTA и точки касания",title:"Использовать согласованные заходы и дисклеймеры во всём контенте и точках касания.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянный стандарт.",is_recurring:true},
  {id:8,section:"CTA и точки касания",title:"Соблюдать схему CTA: конкретный заход → если планируете работу с нами → приглашение обсудить объект → дисклеймер.",owners:["Команда Маркетинга"],status:"В работе",deadline:null,priority:"Высокий",note:"Постоянный стандарт.",is_recurring:true},
  {id:9,section:"CTA и точки касания",title:"Объяснять содержание первой встречи: объект, задачи, сроки, бюджет, формат работы; при необходимости планировка, референсы, бриф.",owners:["Команда Маркетинга","Настя"],status:"Запланировано",deadline:null,priority:"Высокий",note:"Нужно закрепить единый текст.",is_recurring:false},
  {id:10,section:"CTA и точки касания",title:"Обозначать границы первой встречи: без разбора отдельных комнат, точечных вопросов по готовому интерьеру, подбора мебели и отдельных решений.",owners:["Команда Маркетинга","Настя"],status:"Запланировано",deadline:null,priority:"Высокий",note:"Нужно закрепить единый дисклеймер.",is_recurring:false},
  {id:11,section:"CTA и точки касания",title:"Убрать призыв «Бесплатная консультация» из описаний к видео, постов и лендингов; не вести на отдельную страницу бесплатной консультации.",owners:["Надежда","Команда Маркетинга"],status:"В работе",deadline:"2026-10-20",priority:"Критичный",note:"Дедлайн 20.10.",is_recurring:false},
  {id:12,section:"Лид-магниты",title:"Собрать и отобрать реальные рабочие документы студии, полезные потенциальным заказчикам.",owners:["Настя","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Сначала студия предоставляет документы.",is_recurring:false},
  {id:13,section:"Лид-магниты",title:"Подготовить отдельный лендинг под каждый выбранный рабочий документ.",owners:["Надежда","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Срок — в течение недели после предоставления материалов.",is_recurring:false},
  {id:14,section:"Мини-продукт",title:"Внедрить мини-продукт «Планировочные решения (трипваер)».",owners:["Надежда","Команда Маркетинга"],status:"Ждём",deadline:null,priority:"Высокий",note:"Ожидается полное описание и тексты для анонса.",is_recurring:false},
  {id:15,section:"Персонализированные сторис",title:"Показать примеры персонализированных сторис, которые делали в ВВ.",owners:["Надежда"],status:"Запланировано",deadline:null,priority:"Обычный",note:"Дедлайн не указан.",is_recurring:false},
  {id:16,section:"Персонализированные сторис",title:"Адаптировать формат для KRASNOV: запрос клиента + образ жизни + состав семьи → решения проекта → переход к подробностям.",owners:["Надежда","Команда Маркетинга"],status:"Запланировано",deadline:null,priority:"Высокий",note:"После примеров из ВВ.",is_recurring:false}
];

const actorOf = req => {
  const raw = String(req.get("X-Actor") || "Не указано").slice(0,120);
  return ({Nastya:"Настя",Nadezhda:"Надежда",Igor:"Игорь",Marketing:"Команда Маркетинга",YouTube:"Ютуберы"})[raw] || raw;
};

function normalizeTaskRow(r) {
  return {
    ...r,
    deadline: r.deadline ? new Date(r.deadline).toISOString().slice(0,10) : "",
    is_recurring: !!r.is_recurring
  };
}

function cleanTask(t) {
  return {
    section: String(t.section || "").trim(),
    title: String(t.title || "").trim(),
    owners: Array.isArray(t.owners) ? t.owners : [],
    status: String(t.status || "Запланировано"),
    deadline: t.deadline || "",
    priority: String(t.priority || "Обычный"),
    note: String(t.note || ""),
    is_recurring: !!t.is_recurring
  };
}

function taskChanges(before, after) {
  const fields = ["section","title","owners","status","deadline","priority","note","is_recurring"];
  const labels = {section:"Направление",title:"Задача",owners:"Ответственные",status:"Статус",deadline:"Дедлайн",priority:"Приоритет",note:"Комментарий",is_recurring:"Постоянный процесс"};
  const out = {};
  for (const f of fields) {
    const a = JSON.stringify(before?.[f] ?? "");
    const b = JSON.stringify(after?.[f] ?? "");
    if (a !== b) out[f] = { label: labels[f], from: before?.[f] ?? "", to: after?.[f] ?? "" };
  }
  return out;
}

async function addHistory({taskId, action, actor, title, changes, snapshot}) {
  await pool.query(
    "INSERT INTO marketing_task_history (task_id,action,actor,task_title,changes,snapshot) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb)",
    [taskId, action, actor, title || "", JSON.stringify(changes || {}), JSON.stringify(snapshot || {})]
  );
}

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
      status TEXT NOT NULL DEFAULT 'Запланировано',
      deadline DATE,
      priority TEXT NOT NULL DEFAULT 'Обычный',
      note TEXT NOT NULL DEFAULT '',
      is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query("ALTER TABLE marketing_tasks ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN NOT NULL DEFAULT FALSE");
  await pool.query("UPDATE marketing_tasks SET status='Запланировано' WHERE status='Не начато'");
  await pool.query("UPDATE marketing_tasks SET status='В работе' WHERE status='На проверке'");
  await pool.query(`
    UPDATE marketing_tasks
    SET is_recurring=TRUE
    WHERE is_recurring=FALSE AND (
      LOWER(note) LIKE '%постоян%' OR
      LOWER(note) LIKE '%регулярн%' OR
      LOWER(title) LIKE '%постоян%'
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS marketing_task_history (
      id BIGSERIAL PRIMARY KEY,
      task_id BIGINT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL DEFAULT 'Не указано',
      task_title TEXT NOT NULL DEFAULT '',
      changes JSONB NOT NULL DEFAULT '{}'::jsonb,
      snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const count = Number((await pool.query("SELECT COUNT(*) AS n FROM marketing_tasks")).rows[0].n);
  const recurringCount = Number((await pool.query("SELECT COUNT(*) AS n FROM marketing_tasks WHERE is_recurring=TRUE")).rows[0].n);
  console.log("DB TASK SUMMARY", JSON.stringify({count, recurringCount, regularCount: count-recurringCount}));
  if (count === 0) {
    for (const t of seedTasks) {
      await pool.query(
        "INSERT INTO marketing_tasks (id,section,title,owners,status,deadline,priority,note,is_recurring) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9)",
        [t.id,t.section,t.title,JSON.stringify(t.owners),t.status,t.deadline,t.priority,t.note,t.is_recurring]
      );
    }
    const afterSeed = Number((await pool.query("SELECT COUNT(*) AS n FROM marketing_tasks")).rows[0].n);
    console.log("DB SEEDED TASK COUNT", afterSeed);
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
    const { rows } = await pool.query(`
      SELECT
        id::text AS id,
        section,
        title,
        owners,
        status,
        COALESCE(TO_CHAR(deadline,'YYYY-MM-DD'),'') AS deadline,
        priority,
        note,
        is_recurring,
        created_at::text AS created_at,
        updated_at::text AS updated_at
      FROM marketing_tasks
      ORDER BY id
    `);
    console.log("GET /api/tasks ->", rows.length, "rows");
    res.set("Cache-Control","no-store");
    res.json(rows);
  } catch (e) {
    console.error("GET /api/tasks ERROR", e);
    res.status(500).json({error:"database_error",message:e.message});
  }
});

app.get("/api/history", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  const limit = Math.max(1, Math.min(300, Number(req.query.limit || 150)));
  try {
    const { rows } = await pool.query(
      "SELECT id,task_id,action,actor,task_title,changes,snapshot,changed_at FROM marketing_task_history ORDER BY changed_at DESC LIMIT $1",
      [limit]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.post("/api/tasks", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  const t = cleanTask(req.body || {});
  const id = Date.now();
  try {
    const { rows } = await pool.query(
      "INSERT INTO marketing_tasks (id,section,title,owners,status,deadline,priority,note,is_recurring) VALUES ($1,$2,$3,$4::jsonb,$5,NULLIF($6,'')::date,$7,$8,$9) RETURNING *",
      [id,t.section,t.title,JSON.stringify(t.owners),t.status,t.deadline,t.priority,t.note,t.is_recurring]
    );
    const saved = normalizeTaskRow(rows[0]);
    await addHistory({taskId:id, action:"created", actor:actorOf(req), title:saved.title, changes:{}, snapshot:saved});
    res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.put("/api/tasks/:id", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  const t = cleanTask(req.body || {});
  try {
    const oldQ = await pool.query("SELECT * FROM marketing_tasks WHERE id=$1",[req.params.id]);
    if (!oldQ.rows.length) return res.status(404).json({error:"not_found"});
    const before = normalizeTaskRow(oldQ.rows[0]);
    const { rows } = await pool.query(
      "UPDATE marketing_tasks SET section=$2,title=$3,owners=$4::jsonb,status=$5,deadline=NULLIF($6,'')::date,priority=$7,note=$8,is_recurring=$9,updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id,t.section,t.title,JSON.stringify(t.owners),t.status,t.deadline,t.priority,t.note,t.is_recurring]
    );
    const after = normalizeTaskRow(rows[0]);
    await addHistory({taskId:req.params.id, action:"updated", actor:actorOf(req), title:after.title, changes:taskChanges(before,after), snapshot:after});
    res.json(after);
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.delete("/api/tasks/:id", async (req,res) => {
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"database_not_configured"});
  try {
    const oldQ = await pool.query("SELECT * FROM marketing_tasks WHERE id=$1",[req.params.id]);
    if (!oldQ.rows.length) return res.status(404).json({error:"not_found"});
    const before = normalizeTaskRow(oldQ.rows[0]);
    await pool.query("DELETE FROM marketing_tasks WHERE id=$1",[req.params.id]);
    await addHistory({taskId:req.params.id, action:"deleted", actor:actorOf(req), title:before.title, changes:{}, snapshot:before});
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"database_error"});
  }
});

app.get("*", (_req,res) => res.sendFile(path.join(__dirname,"public","index.html")));

initDb().catch(err => console.error("DB init failed:",err.message));
app.listen(PORT, () => console.log("KRASNOV team dashboard on port", PORT));
