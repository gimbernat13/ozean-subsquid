module.exports = class Data1730691825084 {
    name = 'Data1730691825084'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block" integer NOT NULL, "to" text NOT NULL, "from" text NOT NULL, "value" numeric NOT NULL, "tx_hash" text NOT NULL, "reward" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4cbc37e8c3b47ded161f44c24f" ON "transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("from") `)
        await db.query(`CREATE TABLE "user_reward" ("id" character varying NOT NULL, "user" text NOT NULL, "total_reward" numeric NOT NULL, "last_update_block" integer NOT NULL, "last_update_timestamp" numeric NOT NULL, CONSTRAINT "PK_870b280d018d4f7520abec33561" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_bad16e21d83e23ecb4f724b358" ON "user_reward" ("user") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_4cbc37e8c3b47ded161f44c24f"`)
        await db.query(`DROP INDEX "public"."IDX_be54ea276e0f665ffc38630fc0"`)
        await db.query(`DROP TABLE "user_reward"`)
        await db.query(`DROP INDEX "public"."IDX_bad16e21d83e23ecb4f724b358"`)
    }
}
