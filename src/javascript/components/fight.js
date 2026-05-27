import { controls } from '../../constants/controls';

const CRITICAL_HIT_COOLDOWN = 10000;

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const state = {
      first: {
        fighter: { ...firstFighter },
        currentHealth: firstFighter.health,
        blocking: false,
        comboActive: false,
        lastCriticalHitAt: 0,
        comboKeys: new Set(),
      },
      second: {
        fighter: { ...secondFighter },
        currentHealth: secondFighter.health,
        blocking: false,
        comboActive: false,
        lastCriticalHitAt: 0,
        comboKeys: new Set(),
      },
      finished: false,
    };

    const leftIndicator = document.getElementById('left-fighter-indicator');
    const rightIndicator = document.getElementById('right-fighter-indicator');

    const updateHealthBar = (indicator, currentHealth, maxHealth) => {
      if (!indicator) {
        return;
      }

      const healthPercent = Math.max((currentHealth / maxHealth) * 100, 0);
      indicator.style.width = `${healthPercent}%`;
    };

    updateHealthBar(leftIndicator, state.first.currentHealth, state.first.fighter.health);
    updateHealthBar(rightIndicator, state.second.currentHealth, state.second.fighter.health);

    const cleanup = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };

    const finishFight = (winner) => {
      if (state.finished) {
        return;
      }

      state.finished = true;
      cleanup();
      resolve(winner);
    };

    const applyDamage = (attackerState, defenderState, damage) => {
      defenderState.currentHealth = Math.max(defenderState.currentHealth - damage, 0);
      if (defenderState === state.first) {
        updateHealthBar(leftIndicator, defenderState.currentHealth, defenderState.fighter.health);
      } else {
        updateHealthBar(rightIndicator, defenderState.currentHealth, defenderState.fighter.health);
      }

      if (defenderState.currentHealth <= 0) {
        finishFight(attackerState.fighter);
      }
    };

    const attack = (attackerState, defenderState) => {
      if (attackerState.blocking || state.finished) {
        return;
      }

      const damage = defenderState.blocking
        ? getDamage(attackerState.fighter, defenderState.fighter)
        : getHitPower(attackerState.fighter);

      applyDamage(attackerState, defenderState, damage);
    };

    const criticalAttack = (attackerState, defenderState) => {
      if (attackerState.blocking || state.finished) {
        return;
      }

      const now = Date.now();
      if (now - attackerState.lastCriticalHitAt < CRITICAL_HIT_COOLDOWN) {
        return;
      }

      attackerState.lastCriticalHitAt = now;
      const damage = 2 * attackerState.fighter.attack;
      applyDamage(attackerState, defenderState, damage);
    };

    const comboMatches = (pressedKeys, comboKeys) => comboKeys.every((key) => pressedKeys.has(key));

    const onKeyDown = (event) => {
      const { code } = event;

      if (state.finished) {
        return;
      }

      if (code === controls.PlayerOneBlock) {
        state.first.blocking = true;
        return;
      }

      if (code === controls.PlayerTwoBlock) {
        state.second.blocking = true;
        return;
      }

      if (code === controls.PlayerOneAttack) {
        attack(state.first, state.second);
        return;
      }

      if (code === controls.PlayerTwoAttack) {
        attack(state.second, state.first);
        return;
      }

      if (controls.PlayerOneCriticalHitCombination.includes(code)) {
        state.first.comboKeys.add(code);
        if (!state.first.comboActive && comboMatches(state.first.comboKeys, controls.PlayerOneCriticalHitCombination)) {
          state.first.comboActive = true;
          criticalAttack(state.first, state.second);
        }
      }

      if (controls.PlayerTwoCriticalHitCombination.includes(code)) {
        state.second.comboKeys.add(code);
        if (!state.second.comboActive && comboMatches(state.second.comboKeys, controls.PlayerTwoCriticalHitCombination)) {
          state.second.comboActive = true;
          criticalAttack(state.second, state.first);
        }
      }
    };

    const onKeyUp = (event) => {
      const { code } = event;

      if (code === controls.PlayerOneBlock) {
        state.first.blocking = false;
      }

      if (code === controls.PlayerTwoBlock) {
        state.second.blocking = false;
      }

      if (controls.PlayerOneCriticalHitCombination.includes(code)) {
        state.first.comboKeys.delete(code);
        if (!comboMatches(state.first.comboKeys, controls.PlayerOneCriticalHitCombination)) {
          state.first.comboActive = false;
        }
      }

      if (controls.PlayerTwoCriticalHitCombination.includes(code)) {
        state.second.comboKeys.delete(code);
        if (!comboMatches(state.second.comboKeys, controls.PlayerTwoCriticalHitCombination)) {
          state.second.comboActive = false;
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}
