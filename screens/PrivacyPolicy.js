import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <ScrollView className="h-full mt-2 w-[90%] ">
      <View className="items-center">
        <Text className="text-slate-900 font-bold text-lg">Zásady ochrany osobních údajů</Text>
        <Text className="text-slate-900 text-base my-2">
          Aplikace Jídelák zpracovává osobní údaje pouze v případě registrace a jsou důležité ke kompletnímu fungování aplikace.
          Správcem osobních údajů je autor aplikace, Jan Vlček. email: hiskymek@gmail.com
          Zpracování osobních údajů upravuje zejména nařízení Evropského parlamentu
          a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických sobo v souvislosti
          se zpracováním osobních údajů a o volném pohybu těchto údajů a o zrušení směrnice 95/46/ES
          (obecné nařízení o ochraně osobních údajů) („GDPR“).
        </Text>
        <Text className="text-slate-900 text-base my-2">
          Aplikace získává a zpracovává tyto osobní údaje: email, jméno, heslo, věk, pohlaví, váhu, výšku, způsob stravování, stupeň aktivity a cíl.
          Při registraci uživatel musí zadat email, jméno a heslo. S těmito dílčími údaji je schopen využívat většinu funkcionalit aplikace a není povinen vyplňovat "Dotazník", který mu umožní na základě vložených osobních údajů lépe plánovat svůj jídelníček a zobrazovat statistiky svého stravování.
          Vyplněním osobních údajů jsou uživateli aplikace vypočítány doporučené denní makroživiny. Není však povinen se jimi řídit a může je v nastavení kdykoliv upravit změnou osobních údajů.
          Uživatel používáním aplikace vytváří data plánovaných jídel, oblíbených jídel a nákupních seznamů. Tyto data je uživatel sám schopen přidávat, měnit či odebírat v aplikaci.
          Údaje ve formě dat a ostatní data jsou ukládány v databázi aplikace. K datům má přístup pouze osoba, které se údaje a data týkají, a správce osobních údajů. Správce učinil vyšekrá vhodná opatření k zabezpečení osobních údajů a dat.
          Správce nemá v úmyslu s daty nijak nakládat a jsou v databázi uložena pouze k lepšímu chodu aplikace a pohodlí uživatele aplikace. Heslo je v databázi bezpečně uloženo.
          Uživatel zadané údaje může kdykoliv v průběhu používání aplikace změnit a má také nárok na výmaz údajů a to kontaktováním správce osobních údajů. Údaje jsou uchovány po neurčitou dobu a k jejich výmazu dojde pouze v případě potřeby uživatele.
        </Text>
        <Text className="text-slate-900 text-base my-2 font-bold">
          Platné a účinné od 20.3.2024.
        </Text>
      </View>
    </ScrollView>
  )
}