<template>
  <div>
    <ContentTitle>General</ContentTitle>
    <ContentListItem editable>
      <template #list-title> Name </template>
      <template #list-input>
        <input v-model="general.name" type="text" />
      </template>
      <span>{{ general.name }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Coordinate </template>
      <span>{{ general.coordinate }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Level </template>
      <span>{{ general.level }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Exp </template>
      <span>{{ general.exp }}</span>
    </ContentListItem>
    <ContentListItem copiable :copy-value="address">
      <template #list-title> Referrer </template>
      <span>{{ referrer }}</span>
    </ContentListItem>
    <ContentTitle>Stats</ContentTitle>
    <ContentListItem>
      <template #list-title> Health </template>
      <span>{{ stats.health }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Mana </template>
      <span>{{ stats.mana }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Energy </template>
      <span>{{ stats.energy }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Armor </template>
      <span>{{ stats.armor }}</span>
    </ContentListItem>
    <ContentTitle>Character Points</ContentTitle>
    <ContentListItem>
      <template #list-title> Attack </template>
      <span>{{ characterPoints.attack }}</span>
    </ContentListItem>
    <ContentListItem>
      <template #list-title> Defend </template>
      <span>{{ characterPoints.defind }}</span>
    </ContentListItem>
    <ContentTitle>Timers</ContentTitle>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Health </template>
      <span>{{ timer.health }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Mana </template>
      <span>{{ timer.mana }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Energy </template>
      <span>{{ timer.energy }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Revive </template>
      <span>{{ timer.revive }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Teleport </template>
      <span>{{ timer.teleport }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Town TP </template>
      <span>{{ timer.townTP }}</span>
    </ContentListItem>
    <ContentListItem convertable @convert="convert()">
      <template #list-title> Prepare </template>
      <span>{{ timer.prepare }}</span>
    </ContentListItem>
  </div>
</template>

<script setup lang="ts">
import ContentTitle from '~/components/sidebar-items/ContentTitle.vue'
import ContentListItem from '~/components/sidebar-items/ContentListItem.vue'

const address = ref('0xB55F8FC6de35c643a2Ed462d3316706A4159D41D')

const convertTime = ref(24)

const general = reactive({
  name: 'Hadalobo',
  coordinate: '(0,1)',
  level: 4,
  exp: 5,
})
const stats = reactive({
  health: 24,
  mana: 54,
  energy: 17,
  armor: 18,
})
const timer = reactive({
  health: 23237438573957,
  mana: 23237438573957,
  energy: 23237438573957,
  revive: 23237438573957,
  teleport: 23237438573957,
  townTP: 23237438573957,
  prepare: 23237438573957,
})
const characterPoints = reactive({
  attack: 3,
  defind: 1,
})

const referrer = computed(
  () =>
    address.value.substring(0, 5) +
    '...' +
    address.value.substring(address.value.length - 5)
)

const convert = () => {
  timer.health = convertTime.value
}
</script>
