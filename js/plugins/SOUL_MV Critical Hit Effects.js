//----------------------------------------------------------------------------------
// SOUL_MV Critical Hit Effects.js
// Author: Soulpour777
//----------------------------------------------------------------------------------
/*:
* @plugindesc v1.0 Creates a flash or plays an SE when a critical hit is inflicted.
* @author SoulPour777 - soulxregalia.wordpress.com
*
* @help

Critical Hit Effects
A plugin coded by Soulpour777

This plugin does not have any plugin commands.

You can use this for your commercial / non commercial or IGMC games
as long as SoulPour777 is credited.

* @param -- FLASH SETTINGS --
*
* @param Actor Flash Color
* @desc An array that contains the flash color for enemy. [R, G, B, Opacity]
* @default 255, 0, 0, 128
*
* @param Actor Flash Duration
* @desc The duration of the flash for actor.
* @default 8
*
* @param Enemy Flash Color
* @desc An array that contains the flash color for enemy. [R, G, B, Opacity]
* @default 255, 0, 0, 128
*
* @param Enemy Flash Duration
* @desc The duration of the flash for enemy.
* @default 8
*
* @param -- SE SETTINGS --
*
* @param Actor Critical SE
* @desc The SE played when an actor inflicts a critical damage.
* @default Break
*
* @param Actor SE Volume
* @desc The volume of the SE for the actor.
* @default 100
*
* @param Actor SE Pitch
* @desc The pitch of the SE for the actor.
* @default 100
*
* @param Enemy Critical SE
* @desc The SE played when an enemy inflicts a critical damage.
* @default Break
*
* @param Enemy SE Volume
* @desc The volume of the SE for the enemy.
* @default 100
*
* @param Enemy SE Pitch
* @desc The pitch of the SE for the enemy.
* @default 100
*
*/
(function(){
    var SOUL_MV = SOUL_MV || {};
    SOUL_MV.CriticalHitFlash = SOUL_MV.CriticalHitFlash || {};
    SOUL_MV.CriticalHitFlash.params = PluginManager.parameters('SOUL_MV Critical Hit Effects');
    SOUL_MV.CriticalHitFlash.actorFlashColor = SOUL_MV.CriticalHitFlash.params['Actor Flash Color'].split(/\s*,\s*/).filter(function(value) { return !!value; });
    SOUL_MV.CriticalHitFlash.actorFlashDuration = Number(SOUL_MV.CriticalHitFlash.params['Actor Flash Duration'] || 8);
    SOUL_MV.CriticalHitFlash.enemyFlashColor = SOUL_MV.CriticalHitFlash.params['Enemy Flash Color'].split(/\s*,\s*/).filter(function(value) { return !!value; });
    SOUL_MV.CriticalHitFlash.enemyFlashDuration = Number(SOUL_MV.CriticalHitFlash.params['Enemy Flash Duration'] || 8);

    SOUL_MV.CriticalHitFlash.actorCriticalSE = String(SOUL_MV.CriticalHitFlash.params['Actor Critical SE'] || 'Break');
    SOUL_MV.CriticalHitFlash.actorCriticalVol = String(SOUL_MV.CriticalHitFlash.params['Actor SE Volume'] || 100);
    SOUL_MV.CriticalHitFlash.actorCriticalPitch = String(SOUL_MV.CriticalHitFlash.params['Actor SE Pitch'] || 100);
    SOUL_MV.CriticalHitFlash.enemyCriticalSE = String(SOUL_MV.CriticalHitFlash.params['Enemy Critical SE'] || 'Break');
    SOUL_MV.CriticalHitFlash.enemyCriticalVol = String(SOUL_MV.CriticalHitFlash.params['Enemy SE Volume'] || 100);
    SOUL_MV.CriticalHitFlash.enemyCriticalPitch = String(SOUL_MV.CriticalHitFlash.params['Enemy SE Pitch'] || 100);    
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var item = this.item();
        var baseValue = this.evalDamageFormula(target);
        var value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            if (target instanceof Game_Enemy) {
                $gameScreen.criticalFlashForDamageActor();
                value = this.applyCritical(value);
            } else {
                $gameScreen.criticalFlashForDamageEnemy();
                value = this.applyCritical(value);
            }
            
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };

    Game_Screen.prototype.criticalFlashForDamageActor = function() {
        var audio = {
            name: SOUL_MV.CriticalHitFlash.actorCriticalSE,
            volume: SOUL_MV.CriticalHitFlash.actorCriticalVol,
            pitch: SOUL_MV.CriticalHitFlash.actorCriticalPitch,
            pan: 0
        };
        AudioManager.playSe(audio);
        var red = SOUL_MV.CriticalHitFlash.actorFlashColor[0];
        var green = SOUL_MV.CriticalHitFlash.actorFlashColor[1];
        var blue = SOUL_MV.CriticalHitFlash.actorFlashColor[2];
        var alpha = SOUL_MV.CriticalHitFlash.actorFlashColor[3];
        var duration = SOUL_MV.CriticalHitFlash.actorFlashDuration;
        this.startFlash([Number(red), Number(green), Number(blue), Number(alpha)], SOUL_MV.CriticalHitFlash.actorFlashDuration);
    };   
    Game_Screen.prototype.criticalFlashForDamageEnemy = function() {
        var audio = {
            name: SOUL_MV.CriticalHitFlash.enemyCriticalSE,
            volume: SOUL_MV.CriticalHitFlash.enemyCriticalVol,
            pitch: SOUL_MV.CriticalHitFlash.enemyCriticalPitch,
            pan: 0
        };
        AudioManager.playSe(audio);        
        var red = SOUL_MV.CriticalHitFlash.enemyFlashColor[0];
        var green = SOUL_MV.CriticalHitFlash.enemyFlashColor[1];
        var blue = SOUL_MV.CriticalHitFlash.enemyFlashColor[2];
        var alpha = SOUL_MV.CriticalHitFlash.enemyFlashColor[3];
        var duration = SOUL_MV.CriticalHitFlash.enemyFlashDuration;
        this.startFlash([Number(red), Number(green), Number(blue), Number(alpha)], SOUL_MV.CriticalHitFlash.actorFlashDuration);
    };     
})();
