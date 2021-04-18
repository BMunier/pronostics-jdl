package com.bmu.pronostics.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bmu.pronostics.web.rest.TestUtil;

public class CompetitionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Competition.class);
        Competition competition1 = new Competition();
        competition1.setId(1L);
        Competition competition2 = new Competition();
        competition2.setId(competition1.getId());
        assertThat(competition1).isEqualTo(competition2);
        competition2.setId(2L);
        assertThat(competition1).isNotEqualTo(competition2);
        competition1.setId(null);
        assertThat(competition1).isNotEqualTo(competition2);
    }
}
