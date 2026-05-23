# 宝箱系统（方案A）

手机/电脑自适应 Web 宝箱系统。角色分 S（写宝箱者）、M（开宝箱者）、管理员。

技术栈：Next.js App Router + Prisma + PostgreSQL + Cookie Session

---

## 本地开发

```bash
npm install

# 1. 启动本地 PostgreSQL（需要 Docker）
docker compose up -d

# 2. 初始化数据库 + 种子管理员
npx prisma db push
npm run db:seed

# 3. 启动
npm run dev
# → http://localhost:3000
```

默认管理员：`admin` / `admin12345`

---

## 部署上线（Vercel + Neon）

按下面 6 步操作，大约 15 分钟。

### 第 1 步：注册账号

| 服务 | 地址 | 要干什么 |
|---|---|---|
| **GitHub** | https://github.com | 把代码推上去 |
| **Vercel** | https://vercel.com | 部署网站 |
| **Neon** | https://neon.tech | 免费 PostgreSQL 数据库 |

三个都可以用 GitHub 账号一键登录，不用额外注册。

---

### 第 2 步：创建数据库（Neon）

1. 登录 Neon → 点 **Create project**
2. 起个名字如 `treasure-box`
3. 创建完成后，在 **Dashboard** 里复制连接地址，类似：
   ```
   postgresql://treasure-box_owner:xxxxxx@ep-xxx.us-east-2.aws.neon.tech/treasure-box?sslmode=require
   ```

---

### 第 3 步：推代码到 GitHub

在命令行运行（把 `你的用户名` 换成你 GitHub 的用户名）：

```bash
cd D:\code\key

git init
git add .
git commit -m "宝箱系统 Vercel 部署版"

git remote add origin https://github.com/你的用户名/treasure-box.git
git branch -M main
git push -u origin main
```

---

### 第 4 步：Vercel 部署

1. 登录 https://vercel.com → 点 **Add New → Project**
2. 选择 `treasure-box` 仓库 → **Import**
3. 在 **Environment Variables** 里添加：

   | 变量名 | 值 |
   |---|---|
   | `DATABASE_URL` | 第 2 步复制的 Neon 连接地址 |
   | `SESSION_SECRET` | 随便输一串 64 位随机字符（比如敲键盘瞎打） |
   | `SEED_ADMIN_USERNAME` | `admin` |
   | `SEED_ADMIN_PASSWORD` | `admin12345` |

4. 点 **Deploy**，等 2 分钟

---

### 第 5 步：初始化数据库

部署完成后，在 Vercel 项目页面 → **Settings → Functions → Runtime** 确认是 Node.js 18+。

然后本地命令行跑一次建表（需要先装好 Prisma CLI）：

```bash
npx prisma db push
```

> 这步只需要做一次，Vercel 自动部署新代码时不会删数据。

---

### 第 6 步：种管理员

部署完成后，直接访问你 Vercel 给的网址（比如 `https://treasure-box.vercel.app`），用 `admin` / `admin12345` 登录。

> 提示：如果登不进去，在 Vercel 项目页面 → **Deployments** → 点最新部署右侧的三个点 → **Redeploy**，Vercel 会在构建时自动 run seed。

---

## 后续更新代码

改完代码后：

```bash
git add .
git commit -m "描述你的改动"
git push
```

Vercel 检测到 GitHub 推送会自动重新部署！

---

## 默认管理员

| 用户名 | 密码 |
|---|---|
| admin | admin12345 |

在环境变量 `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` 中修改。
