<script setup lang="ts">
// "Coffee of the month" from the Penpot Home board: the photo in a circle, ringed by
// twinkling yellow and red bulbs, with two stickers. Everything is laid out in percent of
// a 372px square so it scales with the widget.
const BULBS = 28
// "COUVEE" bent along the top-left of the ring, 9 degrees per letter, as in Penpot.
const WORD = 'COUVEE'
const letters = [...WORD].map((ch, i) => {
  const deg = -135 + (i - (WORD.length - 1) / 2) * 9
  const rad = (deg * Math.PI) / 180
  return {
    ch,
    style: { left: `${50 + 51.1 * Math.cos(rad)}%`, top: `${50 + 51.1 * Math.sin(rad)}%`, transform: `translate(-50%, -50%) rotate(${deg + 90}deg)` }
  }
})
const bulbs = Array.from({ length: BULBS }, (_, i) => {
  const a = (i / BULBS) * 2 * Math.PI - Math.PI / 2
  return {
    left: `${50 + 44.6 * Math.cos(a)}%`,
    top: `${50 + 44.6 * Math.sin(a)}%`,
    even: i % 2 === 0
  }
})
</script>

<template>
  <div class="relative size-full" data-testid="coffee-widget">
    <div class="coffee-widget absolute inset-[3.5%]">
    <div class="absolute left-[9.27%] top-[9.27%] size-[81.45%] overflow-hidden rounded-full bg-card">
      <img src="/media/widgets/coffee.jpg" alt="Coffee of the month" class="size-full object-cover" draggable="false">
    </div>
    <span
      v-for="(b, i) in bulbs"
      :key="i"
      :class="['coffee-bulb', b.even ? 'coffee-bulb-yellow' : 'coffee-bulb-red']"
      :style="{ left: b.left, top: b.top, animationDelay: `${(i % 7) * -0.23}s` }"
      aria-hidden="true"
    />
    <img src="/media/widgets/sticker-coffee-of-the-month.png" alt="" class="pointer-events-none absolute left-[56.5%] top-[-0.5%] w-[30.4%]" draggable="false">
    <img src="/media/widgets/sticker-yummy-cat.png" alt="" class="pointer-events-none absolute left-[2.1%] top-[58.5%] w-[34.8%]" draggable="false">
    <span v-for="l in letters" :key="l.ch + l.style.left" class="coffee-letter" :style="l.style" aria-hidden="true">{{ l.ch }}</span>
    </div>
  </div>
</template>

<style>
.coffee-widget { container-type: inline-size; }
.coffee-letter {
  position: absolute;
  font-size: 5.9cqw;
  font-weight: 800;
  line-height: 1;
  color: #2d3a3a;
}
.coffee-bulb {
  position: absolute;
  width: 3.76cqw;
  height: 3.76cqw;
  margin: -1.88cqw 0 0 -1.88cqw;
  border-radius: 9999px;
  border: 0.4cqw solid rgb(255 255 255 / 0.9);
  animation: coffee-twinkle 1.4s ease-in-out infinite;
}
.coffee-bulb-yellow { --bulb: #ffd400; background: var(--bulb); }
.coffee-bulb-red { --bulb: #e8212b; background: var(--bulb); animation-direction: alternate-reverse; }
@keyframes coffee-twinkle {
  0%, 100% { opacity: 1; box-shadow: 0 0 2.6cqw 0.7cqw var(--bulb); }
  50% { opacity: 0.35; box-shadow: 0 0 0.6cqw 0 var(--bulb); }
}
@media (prefers-reduced-motion: reduce) {
  .coffee-bulb { animation: none; }
}
</style>
