# Blind Eyes Supabase 接入与部署

独立分支：`codex/blind-eyes-supabase`。实际部署目录为 `Prototype/functional-prototype`（已核对现有 GitHub Actions）。没有修改 CSS、图片、动画、Borrow Eyes 规则或其本地数据格式。

## 1. Supabase 手动执行（先于部署）

1. 打开项目 `qeywblnvvzqatvnyrkaf` → SQL Editor → New query。
2. 将 `supabase/migrations/202610220001_blind_eyes.sql` **完整复制并执行一次**，包括最后的 `commit;`。它是首次安装 migration；成功后不要重复执行。整个文件在一个事务中，出错会回滚，不需要逐段执行。
3. Anonymous Sign-ins 已经开启，已通过 `/auth/v1/settings` 只读确认，无须邮箱注册。
4. SQL 已给 `be_rooms`、`be_messages` 加入 `supabase_realtime` publication，并建立 RLS；不需要手动关闭 RLS。保留 `public` 在 Data API exposed schemas 中（默认配置）；**不要暴露 `blind_private` schema**。
5. 可在 SQL Editor 执行以下只读查询检查安装：

```sql
select count(*) as topics from blind_private.topics; -- 60
select tablename from pg_publication_tables
where pubname = 'supabase_realtime' and tablename in ('be_rooms','be_messages'); -- 两行
```

没有使用管理凭据，也没有从本次工作直接修改线上数据库。前端仅包含指定的 publishable key；不需要 Secret Key、service_role 或数据库密码。

## 2. GitHub Pages 部署

1. 审核独立分支，再将它合并到 `main`（本次交付不会自动合并）。
2. Repository → Settings → Pages → Source 选择 **GitHub Actions**。
3. 合并会触发现有 **Deploy Borrowed Eyes Prototype** workflow。也可在 Actions 中选择该 workflow，Run workflow 并选择 `main`。
4. 等待部署成功，用原网址打开：<https://iris0324.github.io/babear_deco3500/>。若手机仍加载旧代码，先刷新或清除该网站缓存。

继续使用原有静态部署，无 npm build、服务器或 Edge Function。页面通过固定版本 CDN 加载 Supabase JS 2.49.8（地址已确认 HTTP 200），需要网络访问 Supabase 和 jsDelivr。

## 3. 两台／四台手机简测

- 各自从 Welcome 点击原 Guest 按钮，进入 Blind Eyes，选择**同一条 Topic**。第一位看到原等待页面；第二位加入后，双方出现真实匹配确认，可分别 Accept Match → Start Chat。
- 数据库保证每个房间一名 Describer、一名 Guesser。双方角色偏好冲突时，先排队者保留偏好，后加入者分配另一角色；不会因偏好相同一直等不到人。
- 互发文字；Guesser 提交错误答案，双方次数同步，按原顺序解锁线索。正确答案或耗尽次数时双方进入结果页。
- Continue Chat 继续原房间聊天；Find a New Partner 关闭旧房间，返回 Topics 重新选题；Leave Game 关闭房间并返回首页。没有添加下一轮双方同意机制。
- 四台手机可分成两组选择不同 Topic，检查配对和消息互不串房；同 Topic 多人也会形成多个独立双人房间。
- 刷新进行中的游戏可恢复当前有效房间，已结束／退出／过期房间不恢复。等待页面刷新会重查当前配对；新扫码／新访问保留原 Welcome 入口逻辑。

## 4. 生命周期与权限说明

- 数据库事务级 advisory lock 串行处理配对、取消和生命周期写入，队列一个用户一条记录，房间成员固定两种互斥角色；一个用户同时只能属于一个有效房间。约 10 位玩家不需要额外服务。
- 等待页面每 2.5 秒调用原子配对 RPC；房间用 Realtime 收消息与状态，并每 15 秒补查状态，处理断线／退出消息漏收。输入中的聊天草稿在补查时保留。
- 排队心跳超过 65 秒失效，房间成员超过 150 秒未刷新心跳视为离开；下次数据库操作会清理。手机长期锁屏或切后台可能使房间过期。主动退出通常在对方下一次补查（最多约 15 秒，网络正常时）体现；无需可靠性较差的 unload 请求。
- 每个房间的消息存入数据库，仅有效成员能读取。页面显示最近 500 条，旧消息仍保留在数据库。结束后可聊天直到任意一人离开。
- `blind_private.topics` 保存题目、答案和原始素材信息，不授予客户端任何读写权限。公开房间状态不包含答案／图片。角色视图 RPC 在结束前不向 Guesser 返回题目 ID、图片 URL、裁剪、标题或未解锁线索；Describer 只收到绘制原细节所需的图片／裁剪，结束后双方才收到完整结果。猜测在数据库校验，前端不能改角色、次数或结果。
- **现有静态资源的边界：**原 Borrow Eyes 与图库本来就在公开 JS 和 GitHub 中包含同一套作品、题目文字与图片。本次按要求保留它们，因此懂得查看源码的人仍可用 Topic 文字反查原静态数据。这里实现的是联机接口的角色隔离，不能声称公开素材具有完整的防作弊保密性。若要连源码反查也禁止，需要另行拆分 Blind Eyes 专用私密题库／图片存储，这会超出“保留现有素材和其他游戏”的修改范围。
- 创建器发布的新题仍为浏览器本地功能，不会自动进入线上配对题库；SQL 安装现有 60 条题目。Add Friend／Report 等未要求的功能维持原演示行为。
- 原语言、历史、创作草稿、Borrow Eyes 数据都保留。Supabase 身份放在当前 tab 的 sessionStorage，Welcome 与刷新判断沿用现有实现，不执行 localStorage.clear()。

## 5. 本次检查与文件

已通过全部前端 JS 基本语法检查、`git diff --check`；SQL 在临时 PGlite PostgreSQL 环境完整执行，验证 60 个 Topic、10 个身份／5 个房间、跨 Topic 隔离、角色与秘密字段过滤、RLS、重复聊天／猜测请求、结束后聊天与退出。没有进行 UI／自动化浏览器测试，也没有声称完成线上双手机或真实并发压测；Supabase 托管环境与 Realtime websocket 仍以你的手机测试为准。

修改文件：

- `Prototype/functional-prototype/index.html`：仅增加 SDK 和连接脚本标签。
- `src/core/blind-online.js`（新增）：Auth、匹配、Realtime、RPC、退出和恢复。
- `src/core/events.js`：将 Blind Eyes 事件接入连接模块，Guest 建立匿名身份；更新相关数据流说明。
- `src/core/state.js`：联机游戏使用按角色取得的题目数据与服务器次数上限。
- `src/main.js`：刷新时先验证当前房间；恢复等待状态。
- `src/pages/blind.js`：沿用页面结构，替换模拟等待信息和 Topic 数据源；等待时禁用原 Accept Match，配对后启用。
- `src/pages/borrow.js`：共享函数仅增加联机保护：离开 Blind Eyes 后才能开始 Borrow；联机猜测不能走本地计分。Borrow 规则未变。
- `supabase/migrations/202610220001_blind_eyes.sql`（新增）：表、私密题库、匹配／游戏 RPC、RLS、Realtime 与 60 条题目。
- `supabase/BLIND_EYES_SETUP.md`（本文件）。

参考：Supabase 官方 [Anonymous Sign-Ins](https://supabase.com/docs/guides/auth/auth-anonymous)、[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)、[Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)。
