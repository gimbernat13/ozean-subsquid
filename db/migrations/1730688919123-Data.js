module.exports = class Data1730688919123 {
    name = 'Data1730688919123'

    async up(db) {
        await db.query(`CREATE TABLE "user_reward" ("id" character varying NOT NULL, "user" text NOT NULL, "total_reward" numeric NOT NULL, "last_update_block" integer NOT NULL, "last_update_timestamp" numeric NOT NULL, CONSTRAINT "PK_870b280d018d4f7520abec33561" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_bad16e21d83e23ecb4f724b358" ON "user_reward" ("user") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "user_reward"`)
        await db.query(`DROP INDEX "public"."IDX_bad16e21d83e23ecb4f724b358"`)
    }
}
