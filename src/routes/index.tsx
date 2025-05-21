import { db, schema } from "../db";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Counter } from "../components/Counter";

const getCount = createServerFn({ method: "GET" }).handler(async () => {
	const [result] = await db.select().from(schema.countTable).execute();
	return result.value;
});

const incrementCount = createServerFn({ method: "POST" })
	.validator((addBy: number) => addBy)
	.handler(async ({ data }) => {
		const [result] = await db.transaction(async (tx) => {
			const [current] = await tx.select().from(schema.countTable).execute();
			return await tx
				.update(schema.countTable)
				.set({ value: current.value + data })
				.returning()
				.execute();
		});

		return result.value;
	});

// const subscribeEmail = createServerFn({ method: "POST" })
// 	.validator((email: string) => email)
// 	.handler(async ({ data }) => {
// 		await db
// 			.insert(schema.subscriptionsTable)
// 			.values({ email: data })
// 			.execute();
// 	});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getCount(),
});

function Home() {
	const router = useRouter();
	const count = Route.useLoaderData();

	const handleIncrement = async () => {
		await incrementCount({ data: 1 }).then((res) => router.invalidate());
	};

	return (
		<main className="text-center mx-auto p-4 space-y-10 max-w-xl mb-20">
			<header>
				<h1 className="text-4xl font-bold">Shuffle a Deck. Make History.</h1>
			</header>
			<div className="space-y-4">
				<p>
					Ever shuffled a deck of cards? You've likely created an order that's
					<strong> never existed before. Anywhere. Ever.</strong>
				</p>
				<p>Seriously.</p>
				<p>
					The number of ways to arrange 52 cards is so mind-bogglingly vast that
					every thorough shuffle is almost certainly a cosmic first. It's a
					number with 68 digits!
				</p>
				<p>To be precise...</p>
			</div>
			<div className="font-mono text-4xl mx-auto wrap-anywhere text-wrap w-[4ch]">
				+80,658,175,170,900,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000,000.
			</div>
			<div className="space-y-4">
				<p>
					Imagine the roman colluseum full of people, and each person holds a
					button. When pressed, the button will increment a shared counter.
					That's about 60,000 people. If each person presses their button once
					per second, it will take 426,275,659 × 10 <sup>55</sup> years to reach
					52 factorial.
				</p>
				<p>Go ahead and try!</p>
				<div className="flex flex-col justify-center items-center gap-3">
					<Counter count={count} onIncrement={handleIncrement} />
				</div>
			</div>
			{/* <div className="rounded-lg px-4 py-6 bg-slate-800 flex flex-col gap-5">
				<p className="text-xl">Find out when the percentage changes</p>
				<form className="*:data-[slot=input]:rounded-r-none flex *:data-[slot=button]:rounded-l-none *:data-[slot=button]:border-l-0">
					<input
						data-slot="input"
						type="email"
						className="rounded-md border border-slate-600 px-2 py-1 w-full"
						placeholder="Enter your email..."
					/>
					<button
						data-slot="button"
						className="rounded-md border border-slate-600 p-2"
						type="button"
					>
						Subscribe
					</button>
				</form>
			</div> */}
		</main>
	);
}
