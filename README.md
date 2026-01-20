#初期環境構築
docker compose up -d
docker compose exec backend sh
npx prisma db push

#backend
##schema.prisma変更時
 - 以下のコマンドを打たないと反映されない
     - npx prisma generate
 - スキーマ変更をDBに反映する場合は以下も打つ
     - prisma migrate dev
     - prisma db push
