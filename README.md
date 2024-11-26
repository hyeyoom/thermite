# Block6

[블럭식스](https://block6-three.vercel.app/)

# Inspired by

[시간을 선택하는 기술 블럭식스](https://www.yes24.com/Product/Goods/104868817)

나같이 시간을 마이크로 단위로 쪼개서 쓸 수 없는 사람한테 적당한 것 같아서 좋았다.  
그런데 종이에 정성스럽게 적을 자신이 없어서 서비스를 만들었다. 귀찮기 때문에.

vercel + supabase 무료티어로 서비스 중

# Getting Started

개발하려면?

```bash
yarn dev
```

[http://localhost:3000](http://localhost:3000) 열어서 결과 확인.

저장소에 합치고 싶으면?

```bash
yarn run build
```

제발 빌드 성공하는건 볼 것(은 내게 하는 말)

## .env에는 뭐가 있나요

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_GOOGLE_CALLBACK_URL=
```

## 스키마는?

쓰기 귀찮아.

## magic

supabase의 은혜를 경험하세요.

```bash
npx supabase login
npx supabase gen types typescript --project-id [PROJECT_ID] --schema public > types/supabase.ts
```

