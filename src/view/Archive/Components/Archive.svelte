<script>
	import IconDownload from "~icons/tabler/download";

	export let name;
	export let date;
	// export let id;
	export let openArchive = () => {};
	export let exportArchive = () => {};

	import { localize } from "../../../lib/utils.js";
</script>

<button class="inside-button" on:click={openArchive}>
	<div class="text-base text-left">{name}</div>
	<footer class="flex text-xs">
		<button
			class="m-0 p-0 text-center w-min border-none"
			data-tooltip={localize("vce.archive.export")}
			on:click|stopPropagation={exportArchive}
		>
			<IconDownload />
		</button>
		<div class="ml-auto">
			{localize("vce.archive.time", {
				date: new Date(date).toISOString().split("T")[0].replaceAll("-", "/"),
				time: `${new Date(date).getHours()}:${new Date(date).getMinutes()}`,
			})}
		</div>
	</footer>
</button>
