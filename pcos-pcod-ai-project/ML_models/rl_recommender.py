import numpy as np
import joblib
import os

class RLRecommender:
    def __init__(self, n_bmi=5, n_sleep=3, n_steps=3, n_stress=3, n_cycle=2):
        self.n_bmi = n_bmi
        self.n_sleep = n_sleep
        self.n_steps = n_steps
        self.n_stress = n_stress
        self.n_cycle = n_cycle
        
        self.actions = ['Low_GI_Diet', 'Exercise_Plan', 'Yoga', 'Sleep_Improvement', 'Stress_Meditation']
        self.n_actions = len(self.actions)
        
        # Q-table shape: (BMI, Sleep, Steps, Stress, Cycle, Action)
        self.q_table = np.zeros((n_bmi, n_sleep, n_steps, n_stress, n_cycle, self.n_actions))
        
        self.alpha = 0.1 # Learning rate
        self.gamma = 0.9 # Discount factor
        self.epsilon = 0.1 # Epsilon-greedy
        
    def _get_state_index(self, bmi, sleep, steps, stress, cycle_irreg):
        # Binning logic
        bmi_idx = min(int(bmi / 10), self.n_bmi - 1) # 0-10, 10-20, 20-30, 30-40, 40+
        sleep_idx = 0 if sleep < 6 else (1 if sleep < 8 else 2)
        steps_idx = 0 if steps < 5000 else (1 if steps < 10000 else 2)
        stress_idx = min(int(stress / 3.4), self.n_stress - 1) # 0-10 scale
        cycle_idx = 1 if cycle_irreg else 0
        
        return (bmi_idx, sleep_idx, steps_idx, stress_idx, cycle_idx)

    def select_action(self, bmi, sleep, steps, stress, cycle_irreg):
        state = self._get_state_index(bmi, sleep, steps, stress, cycle_irreg)
        if np.random.uniform(0, 1) < self.epsilon:
            action_idx = np.random.choice(self.n_actions)
        else:
            action_idx = np.argmax(self.q_table[state])
        
        return self.actions[action_idx]

    def update_q_table(self, bmi, sleep, steps, stress, cycle_irreg, action, reward, next_bmi, next_sleep, next_steps, next_stress, next_cycle_irreg):
        state = self._get_state_index(bmi, sleep, steps, stress, cycle_irreg)
        next_state = self._get_state_index(next_bmi, next_sleep, next_steps, next_stress, next_cycle_irreg)
        action_idx = self.actions.index(action)
        
        best_next_action = np.argmax(self.q_table[next_state])
        td_target = reward + self.gamma * self.q_table[next_state + (best_next_action,)]
        td_error = td_target - self.q_table[state + (action_idx,)]
        self.q_table[state + (action_idx,)] += self.alpha * td_error

    def save(self, path='models/rl_recommender.joblib'):
        joblib.dump(self.q_table, path)

    def load(self, path='models/rl_recommender.joblib'):
        if os.path.exists(path):
            self.q_table = joblib.load(path)

if __name__ == "__main__":
    recommender = RLRecommender()
    # Initialize with some knowledge or just save zeros
    recommender.save()
    print("RL Recommender initialized and saved.")
