module.exports = class Data1730705003745 {
    name = 'Data1730705003745'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block" integer NOT NULL, "to" text NOT NULL, "from" text NOT NULL, "value" numeric NOT NULL, "tx_hash" text NOT NULL, "reward" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4cbc37e8c3b47ded161f44c24f" ON "transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("from") `)
        await db.query(`CREATE TABLE "reward_history" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "block" integer NOT NULL, "timestamp" numeric NOT NULL, "tier_at_time" text NOT NULL, "multiplier" numeric NOT NULL, "user_reward_id" character varying, "transfer_id" character varying, CONSTRAINT "PK_1790d3b4570b3f09a5d486b8193" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_68127e5bc4efbec67ab0befb55" ON "reward_history" ("user_reward_id") `)
        await db.query(`CREATE INDEX "IDX_78a8878b3d0c08a9a0cfa923fb" ON "reward_history" ("transfer_id") `)
        await db.query(`CREATE TABLE "user_reward" ("id" character varying NOT NULL, "user" text NOT NULL, "total_reward" numeric NOT NULL, "last_update_block" integer NOT NULL, "last_update_timestamp" numeric NOT NULL, "transaction_count" integer NOT NULL, "current_tier" text NOT NULL, CONSTRAINT "PK_870b280d018d4f7520abec33561" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_bad16e21d83e23ecb4f724b358" ON "user_reward" ("user") `)
        await db.query(`ALTER TABLE "reward_history" ADD CONSTRAINT "FK_68127e5bc4efbec67ab0befb551" FOREIGN KEY ("user_reward_id") REFERENCES "user_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "reward_history" ADD CONSTRAINT "FK_78a8878b3d0c08a9a0cfa923fbe" FOREIGN KEY ("transfer_id") REFERENCES "transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_4cbc37e8c3b47ded161f44c24f"`)
        await db.query(`DROP INDEX "public"."IDX_be54ea276e0f665ffc38630fc0"`)
        await db.query(`DROP TABLE "reward_history"`)
        await db.query(`DROP INDEX "public"."IDX_68127e5bc4efbec67ab0befb55"`)
        await db.query(`DROP INDEX "public"."IDX_78a8878b3d0c08a9a0cfa923fb"`)
        await db.query(`DROP TABLE "user_reward"`)
        await db.query(`DROP INDEX "public"."IDX_bad16e21d83e23ecb4f724b358"`)
        await db.query(`ALTER TABLE "reward_history" DROP CONSTRAINT "FK_68127e5bc4efbec67ab0befb551"`)
        await db.query(`ALTER TABLE "reward_history" DROP CONSTRAINT "FK_78a8878b3d0c08a9a0cfa923fbe"`)
    }
}
